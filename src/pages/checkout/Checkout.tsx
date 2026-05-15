import { useState, useMemo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { API } from "@/lib/axios";
import type { ApiProduct } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useCart, useAppSelector } from "@/redux/hooks";
import { useCreateOrder } from "@/pages/checkout/api/use-create-orders";
import { useInitializePayment } from "@/pages/checkout/api/use-initialize-payment";
import { toast } from "sonner";
import {
  isValidJumiaCity,
  getJumiaZoneForCity,
  getDeliveryFee,
  jumiaZone,
} from "@/data/nigeria-geo";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  MapPin,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  Shield,
  Copy,
  CheckCircle,
  Package,
  ChevronsUpDown,
} from "lucide-react";
import dojuLogo from "@/assets/doju-logo.jpg";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";
import { useUpdateProfile } from "@/pages/seller/api/use-update-profile";

interface CheckoutStep {
  id: string;
  question: string;
  placeholder: string;
  type: "text" | "tel" | "textarea" | "select";
  icon: React.ReactNode;
  required: boolean;
}

interface CreatedOrder {
  id: string;
  buyer: { id: string; fullName: string; email: string };
  product: { id: string; name: string; price: number; imageUrl: string[] };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  bulkOrderId?: string; // included on individual orders now
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  notes: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface BulkOrderResponse {
  orderId: string;
  totalPrice: number;
  orders: CreatedOrder[];
}

const zoneColors: Record<number, string> = {
  1: "bg-emerald-500/15 text-emerald-600",
  2: "bg-blue-500/15 text-blue-600",
  3: "bg-violet-500/15 text-violet-600",
  4: "bg-amber-500/15 text-amber-600",
  5: "bg-rose-500/15 text-rose-600",
  6: "bg-cyan-500/15 text-cyan-600",
  7: "bg-orange-500/15 text-orange-600",
};

function CitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (city: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between gap-2 rounded-xl border px-4 py-3.5 text-left text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-doju-lime/50 ${
            value
              ? "border-doju-lime bg-doju-lime/5 text-foreground"
              : "border-border bg-background text-muted-foreground"
          }`}
        >
          <span className="flex items-center gap-2 min-w-0">
            <MapPin className={`h-4 w-4 shrink-0 ${value ? "text-doju-lime" : "text-muted-foreground"}`} />
            <span className="truncate">{value || "Select your delivery city"}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-xl"
        align="start"
        sideOffset={6}
      >
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput placeholder="Search city…" className="h-11 flex-1 bg-transparent" />
          </div>
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No city found.
          </CommandEmpty>
          <CommandList className="max-h-72 overflow-y-auto">
            {Object.entries(jumiaZone).map(([zoneName, cities]) => {
              const zoneNum = parseInt(zoneName.replace("ZONE", ""));
              return (
                <CommandGroup
                  key={zoneName}
                  heading={
                    <div className="flex items-center gap-2 py-0.5">
                      <span
                        className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold ${zoneColors[zoneNum] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {zoneNum}
                      </span>
                      <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                        Zone {zoneNum}
                      </span>
                    </div>
                  }
                >
                  {cities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={(val) => {
                        onChange(val === value ? "" : val);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{city}</span>
                      {value === city && (
                        <Check className="h-4 w-4 text-doju-lime shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();

  // Enrich cart items that are missing sellerCity by fetching individual product details
  const missingCityIds = useMemo(
    () => items.filter((i) => !i.product.sellerCity).map((i) => i.product.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map((i) => i.product.id).join(",")],
  );
  const productQueries = useQueries({
    queries: missingCityIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: async (): Promise<ApiProduct> => {
        const res = await API.get(`/products/${id}`);
        return res.data;
      },
      staleTime: 5 * 60 * 1000,
    })),
  });
  const enrichedItems = useMemo(() => {
    const cityMap: Record<string, string> = {};
    missingCityIds.forEach((id, idx) => {
      const city = productQueries[idx]?.data?.seller?.businessCity;
      if (city) cityMap[id] = city;
    });
    return items.map((item) =>
      item.product.sellerCity
        ? item
        : {
            ...item,
            product: {
              ...item.product,
              sellerCity: cityMap[item.product.id] ?? undefined,
            },
          },
    );
  }, [items, missingCityIds, productQueries]);

  const user = useAppSelector((state) => state.authData.user);
  const { data: profileData, isLoading: profileLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const createOrderMutation = useCreateOrder();
  const initializePaymentMutation = useInitializePayment();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<BulkOrderResponse | null>(
    null,
  );
  const [useSavedCity, setUseSavedCity] = useState<boolean | null>(null);
  const [useSavedPhone, setUseSavedPhone] = useState<boolean | null>(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isComplete) {
      navigate("/cart");
    }
  }, [items.length, isComplete, navigate]);

  const savedCity = profileData?.user?.city ?? null;
  const savedPhone = profileData?.user?.phoneNumber;
  const hasSavedCity = isValidJumiaCity(savedCity);
  const hasSavedPhone = Boolean(savedPhone);

  // tax and shipping have been removed per requirement
  const total = totalAmount;

  const steps: CheckoutStep[] = useMemo(() => {
    const phoneStep: CheckoutStep = {
      id: "phone",
      question: "What's the best number to reach you?",
      placeholder: "+234 800 000 0000",
      type: "tel",
      icon: <Phone className="h-6 w-6" />,
      required: true,
    };

    const cityStep: CheckoutStep = {
      id: "city",
      question: "Which city will you be delivering to?",
      placeholder: "Select your city",
      type: "select",
      icon: <MapPin className="h-6 w-6" />,
      required: true,
    };

    const addressStep: CheckoutStep = {
      id: "address",
      question: "What's your street address?",
      placeholder: "House number, street, area",
      type: "text",
      icon: <MapPin className="h-6 w-6" />,
      required: true,
    };

    const noteStep: CheckoutStep = {
      id: "notes",
      question: "Anything else you want us to know?",
      placeholder:
        "Special delivery instructions, gate codes, landmarks... (optional)",
      type: "textarea",
      icon: <MessageSquare className="h-6 w-6" />,
      required: false,
    };

    const result: CheckoutStep[] = [];

    if (!profileLoading && hasSavedPhone && useSavedPhone === null) {
      result.push({
        id: "phoneChoice",
        question: "Would you like to use your saved phone number or enter a new one?",
        placeholder: "",
        type: "text",
        icon: <Phone className="h-6 w-6" />,
        required: true,
      });
    }

    if (!profileLoading && hasSavedCity && useSavedCity === null) {
      result.push({
        id: "cityChoice",
        question: "Would you like to deliver to your saved city?",
        placeholder: "",
        type: "text",
        icon: <MapPin className="h-6 w-6" />,
        required: true,
      });
    }

    if (useSavedPhone !== true) {
      result.push(phoneStep);
    }

    if (useSavedCity !== true) {
      result.push(cityStep);
    }

    result.push(addressStep);
    result.push(noteStep);

    return result;
  }, [hasSavedCity, hasSavedPhone, profileLoading, useSavedCity, useSavedPhone]);

  const progress = showReview
    ? 100
    : ((currentStep + 1) / (steps.length + 1)) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNext = () => {
    const step = steps[currentStep];
    if (
      step.required &&
      !formData[step.id] &&
      step.id !== "cityChoice" &&
      step.id !== "phoneChoice"
    )
      return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/cart");
    }
  };

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [steps[currentStep].id]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }

    setPlacingOrder(true);

    try {
      const selectedCity = useSavedCity ? (savedCity ?? "") : (formData.city ?? "");
      const combinedDeliveryAddress = [formData.address, selectedCity]
        .filter(Boolean)
        .join(", ");

      // Save city to profile (and optionally the full street address)
      const profileUpdates: { city?: string; address?: string } = {
        city: selectedCity,
      };
      if (saveNewAddress && formData.address) {
        profileUpdates.address = combinedDeliveryAddress;
      }
      await updateProfileMutation.mutateAsync(profileUpdates);

      // Step 1: Create bulk order via API
      const result: BulkOrderResponse = await createOrderMutation.mutateAsync({
        productIds: items.map((item) => item.product.id),
        quantities: items.map((item) => item.quantity),
        deliveryAddress: combinedDeliveryAddress,
        note: formData.notes || undefined,
        deliveryCity: selectedCity,
      });

      if (result && result.orders && result.orders.length > 0) {
        setOrderResult(result);

        // Step 2: Initialize payment using bulk order id
        const paymentData = await initializePaymentMutation.mutateAsync({
          bulkOrderId: result.orderId,
          callbackUrl: `${import.meta.env.VITE_APP_URL || window.location.origin}/track-order`,
        });

        if (paymentData?.authorizationUrl) {
          // Redirect to Paystack checkout — cart is cleared on callback, not here
          window.location.href = paymentData.authorizationUrl;
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const copyTransactionId = () => {
    if (orderResult && orderResult.orders.length > 0) {
      navigator.clipboard.writeText(orderResult.orders[0].transactionId);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const currentValue = formData[steps[currentStep]?.id] || "";
  const currentStepData = steps[currentStep];
  const selectedCity = useSavedCity ? (savedCity ?? "") : (formData.city ?? "");
  const buyerZone = getJumiaZoneForCity(selectedCity);

  const isValid =
    currentStepData?.id === "cityChoice" ||
    currentStepData?.id === "phoneChoice"
      ? true
      : currentStepData?.required
        ? currentValue.length > 0
        : true;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Generate order ID
  const orderId = useMemo(() => {
    return `DJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }, []);

  // Order complete screen
  if (isComplete && orderResult && orderResult.orders.length > 0) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={dojuLogo}
                alt="DOJU"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">DOJU</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="h-24 w-24 rounded-full bg-doju-lime flex items-center justify-center">
                <Check className="h-12 w-12 text-doju-navy" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Order Placed Successfully!
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Thank you for shopping with DOJU. Your order is confirmed and
              we'll start processing it right away.
            </motion.p>

            {/* Order Code Display */}
            <motion.div
              className="rounded-xl border-2 border-doju-lime/30 bg-doju-lime/5 p-6 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-doju-lime" />
                <h3 className="font-semibold text-foreground">
                  Your Transaction ID
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Keep this for your records
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-semibold text-foreground">
                  {orderResult?.orders[0].transactionId}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={copyTransactionId}
                >
                  {codeCopied ? (
                    <CheckCircle className="h-5 w-5 text-doju-lime" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Order ID:{" "}
                <span className="font-medium">{orderResult?.orders[0].id}</span>
              </p>
            </motion.div>

            {/* Action Buttons - Two Large Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Link
                to="/track-order"
                state={{ orderData: orderResult?.orders }}
                className="block"
              >
                <Button
                  variant="doju-primary"
                  size="xl"
                  className="w-full gap-2"
                >
                  <Package className="h-5 w-5" />
                  Track Order
                </Button>
              </Link>
              <Link to="/marketplace" className="block">
                <Button
                  variant="doju-outline"
                  size="xl"
                  className="w-full gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Order review screen
  if (showReview) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src={dojuLogo}
                alt="DOJU"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">DOJU</span>
            </Link>
            <div className="w-16" />
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-lg mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Progress value={100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Review your order
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Almost there! Review your order
              </h1>

              {/* Order Items */}
              <div className="rounded-xl border border-border bg-card p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="h-5 w-5 text-doju-lime" />
                  <h2 className="font-semibold text-foreground">Your items</h2>
                </div>
                <div className="space-y-4">
                  {enrichedItems.map((item) => {
                    const fee = item.product.sellerCity
                      ? getDeliveryFee(item.product.sellerCity, selectedCity)
                      : null;
                    return (
                      <div key={item.product.id}>
                        <div className="flex gap-3">
                          <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                        {/* Delivery route for this item */}
                        <div className="mt-2 ml-[68px] rounded-lg bg-muted/50 px-3 py-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                            <MapPin className="h-3 w-3 shrink-0 text-doju-lime" />
                            <span className="truncate">
                              {item.product.sellerCity ?? "Seller location TBC"}
                            </span>
                            <span className="shrink-0">→</span>
                            <span className="font-medium text-foreground truncate">
                              {selectedCity || "—"}
                            </span>
                          </div>
                          {fee ? (
                            <span className="text-xs font-semibold text-doju-lime shrink-0">
                              {formatPrice(fee.fee)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground shrink-0">TBC</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-xl border border-border bg-card p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-doju-lime" />
                  <h2 className="font-semibold text-foreground">Delivery</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">City</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedCity}
                      {buyerZone && (
                        <span className="ml-1.5 text-xs font-normal text-doju-lime">Zone {buyerZone}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">Address</span>
                    <span className="text-sm text-foreground">{formData.address || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">Phone</span>
                    <span className="text-sm text-foreground">{formData.phone || "—"}</span>
                  </div>
                  {formData.notes && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground w-16 shrink-0">Note</span>
                      <span className="text-sm text-muted-foreground italic">"{formData.notes}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              {(() => {
                const knownDeliveryTotal = enrichedItems.reduce((sum, item) => {
                  const fee = item.product.sellerCity
                    ? getDeliveryFee(item.product.sellerCity, selectedCity)
                    : null;
                  return sum + (fee?.fee ?? 0);
                }, 0);
                const hasUnknownFees = enrichedItems.some((item) => !item.product.sellerCity);
                const grandTotal = total + knownDeliveryTotal;
                return (
                  <div className="rounded-xl border border-border bg-card p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-doju-lime" />
                      <h2 className="font-semibold text-foreground">Payment</h2>
                    </div>
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-muted/50">
                      <CreditCard className="h-4 w-4 text-doju-lime" />
                      <span className="text-sm text-foreground">Pay via Flutterwave</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>
                          {knownDeliveryTotal > 0
                            ? formatPrice(knownDeliveryTotal) + (hasUnknownFees ? " + more" : "")
                            : hasUnknownFees
                              ? "Calculated on dispatch"
                              : formatPrice(0)}
                        </span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-doju-lime">
                          {formatPrice(grandTotal)}
                          {hasUnknownFees && knownDeliveryTotal === 0 && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">+ delivery</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Confirm Button */}
              {(() => {
                const knownDeliveryTotal = enrichedItems.reduce((sum, item) => {
                  const fee = item.product.sellerCity
                    ? getDeliveryFee(item.product.sellerCity, selectedCity)
                    : null;
                  return sum + (fee?.fee ?? 0);
                }, 0);
                return (
                  <Button
                    variant="doju-primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-doju-navy" />
                        Processing...
                      </div>
                    ) : (
                      `Confirm & Pay ${formatPrice(total + knownDeliveryTotal)}`
                    )}
                  </Button>
                );
              })()}

              <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Secure checkout powered by DOJU</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Step-by-step checkout
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={dojuLogo}
              alt="DOJU"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-foreground">DOJU</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {profileLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Loading your information...
              </p>
            </div>
          ) : (
            <>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Icon */}
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-doju-lime/20 flex items-center justify-center text-doju-lime">
                      {currentStepData.icon}
                    </div>
                  </motion.div>

                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                    {currentStepData.question}
                  </h1>

                  {currentStepData.id === "phoneChoice" ? (
                    <div className="space-y-4 mb-6">
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-2">Use saved phone</h3>
                        <p className="text-sm text-muted-foreground">
                          {savedPhone}
                        </p>
                      </div>
                      <div className="flex gap-3 flex-col sm:flex-row">
                        <Button
                          variant="doju-primary"
                          className="flex-1"
                          onClick={() => {
                            setUseSavedPhone(true);
                            setFormData((prev) => ({
                              ...prev,
                              phone: savedPhone ?? "",
                            }));
                          }}
                        >
                          Use saved phone
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setUseSavedPhone(false)}
                        >
                          Enter new phone
                        </Button>
                      </div>
                    </div>
                  ) : currentStepData.id === "cityChoice" ? (
                    <div className="space-y-4 mb-6">
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold mb-1">Saved city</h3>
                        <p className="text-sm text-muted-foreground">
                          {savedCity}
                          {getJumiaZoneForCity(savedCity ?? "") && (
                            <span className="ml-2 text-doju-lime font-medium">
                              Zone {getJumiaZoneForCity(savedCity ?? "")}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-3 flex-col sm:flex-row">
                        <Button
                          variant="doju-primary"
                          className="flex-1"
                          onClick={() => {
                            setUseSavedCity(true);
                            setFormData((prev) => ({ ...prev, city: savedCity ?? "" }));
                          }}
                        >
                          Use saved city
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setUseSavedCity(false)}
                        >
                          Choose different city
                        </Button>
                      </div>
                    </div>
                  ) : currentStepData.type === "textarea" ? (
                    <Textarea
                      placeholder={currentStepData.placeholder}
                      value={currentValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="text-lg min-h-[120px] mb-6"
                      autoFocus
                    />
                  ) : currentStepData.type === "select" ? (
                    <div className="mb-6">
                      <CitySelect
                        value={currentValue}
                        onChange={(city) => handleInputChange(city)}
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <Input
                        type={currentStepData.type}
                        placeholder={currentStepData.placeholder}
                        value={currentValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="text-lg h-14 mb-4"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && isValid) {
                            handleNext();
                          }
                        }}
                      />
                      {currentStepData.id === "address" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="saveAddress"
                            checked={saveNewAddress}
                            onCheckedChange={(checked) =>
                              setSaveNewAddress(checked as boolean)
                            }
                          />
                          <label
                            htmlFor="saveAddress"
                            className="text-sm text-muted-foreground cursor-pointer"
                          >
                            Save this address for future orders
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="doju-primary"
                      size="lg"
                      className="w-full"
                      disabled={!isValid}
                      onClick={handleNext}
                    >
                      {currentStep === steps.length - 1
                        ? "Review Order"
                        : "Continue"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    {!currentStepData.required && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={handleNext}
                      >
                        Skip this step
                      </Button>
                    )}
                  </motion.div>

                  {/* Step indicators */}
                  <div className="flex justify-center gap-2 mt-8">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index <= currentStep ? "bg-doju-lime" : "bg-muted"
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: index === currentStep ? 1.2 : 1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;

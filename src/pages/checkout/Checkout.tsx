import { useState, useMemo, useEffect } from "react";
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
  jumiaZone,
} from "@/data/nigeria-geo";
import {
  getPickupStationsForZone,
  type PickupStation,
} from "@/data/pickup-stations";
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
  Package,
  ChevronsUpDown,
  Truck,
  ChevronRight,
  Loader2,
  Store,
  Clock,
  ExternalLink,
} from "lucide-react";
import dojuLogo from "@/assets/doju-logo.jpg";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";
import { useUpdateProfile } from "@/pages/seller/api/use-update-profile";

interface CheckoutStep {
  id: string;
  question: string;
  placeholder: string;
  type: "text" | "tel" | "textarea" | "select" | "pickup";
  icon: React.ReactNode;
  required: boolean;
}

interface OrderItem {
  id: string;
  buyer: { id: string; fullName: string; email: string };
  product: { id: string; name: string; price: number; imageUrl: string[] };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  estimatedDeliveryDays: string;
  estimatedPlatformFee: number;
  estimatedSellerAmount: number;
  bulkOrderId: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  notes: string | null;
  transactionId: string;
  createdAt: string;
}

interface BulkOrderResponse {
  orderId: string;
  totalPrice: number;
  bulkDeliveryFee: number;
  bulkEstimatedPlatformFee: number;
  bulkEstimatedSellerAmount: number;
  orders: OrderItem[];
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

function PickupStationSelect({
  value,
  onChange,
  zone,
}: {
  value: string;
  onChange: (name: string) => void;
  zone: number | null;
}) {
  const [open, setOpen] = useState(false);
  const stations = zone ? getPickupStationsForZone(zone) : [];

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
            <Store className={`h-4 w-4 shrink-0 ${value ? "text-doju-lime" : "text-muted-foreground"}`} />
            <span className="truncate">{value || "Select a pickup station"}</span>
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
            <CommandInput placeholder="Search station or area…" className="h-11 flex-1 bg-transparent" />
          </div>
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No pickup station found.
          </CommandEmpty>
          <CommandList className="max-h-80 overflow-y-auto">
            {stations.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No stations for this zone.
              </div>
            ) : (
              <CommandGroup heading={`Zone ${zone} — ${stations.length} stations`}>
                {stations.map((station) => (
                  <CommandItem
                    key={station.name}
                    value={`${station.name} ${station.city} ${station.address}`}
                    onSelect={() => {
                      onChange(value === station.name ? "" : station.name);
                      setOpen(false);
                    }}
                    className="flex items-start justify-between gap-2 cursor-pointer py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{station.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{station.address}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{station.city}</p>
                    </div>
                    {value === station.name && (
                      <Check className="h-4 w-4 text-doju-lime shrink-0 mt-0.5" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Card shown below the combobox when a station is selected
function PickupStationCard({ station }: { station: PickupStation }) {
  return (
    <div className="mt-3 rounded-xl border border-doju-lime/30 bg-doju-lime/5 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{station.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{station.city} · Zone {station.zone}</p>
        </div>
        {station.mapUrl && (
          <a
            href={station.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-doju-lime hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{station.address}</p>
      {station.nearPlace && station.nearPlace !== station.address && (
        <p className="text-xs text-muted-foreground/70">Near: {station.nearPlace}</p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{station.openingHours}</span>
      </div>
    </div>
  );
}

const Checkout = () => {
  const { items } = useCart();

  const user = useAppSelector((state) => state.authData.user);
  const { data: profileData, isLoading: profileLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateProfile({ silent: true });
  const createOrderMutation = useCreateOrder();
  const initializePaymentMutation = useInitializePayment();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<BulkOrderResponse | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [useSavedCity, setUseSavedCity] = useState<boolean | null>(null);
  const [useSavedPhone, setUseSavedPhone] = useState<boolean | null>(null);

  useEffect(() => {
    if (items.length === 0 && !orderResult) {
      navigate("/cart");
    }
  }, [items.length, orderResult, navigate]);

  const savedCity = profileData?.user?.city ?? null;
  const savedPhone = profileData?.user?.phoneNumber;
  const hasSavedCity = isValidJumiaCity(savedCity);
  const hasSavedPhone = Boolean(savedPhone);

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
    const pickupStep: CheckoutStep = {
      id: "pickupStore",
      question: "Choose your nearest pickup station",
      placeholder: "",
      type: "pickup",
      icon: <Store className="h-6 w-6" />,
      required: true,
    };
    const noteStep: CheckoutStep = {
      id: "notes",
      question: "Anything else you want us to know?",
      placeholder: "Special delivery instructions, gate codes, landmarks… (optional)",
      type: "textarea",
      icon: <MessageSquare className="h-6 w-6" />,
      required: false,
    };

    const result: CheckoutStep[] = [];

    if (!profileLoading && hasSavedPhone && useSavedPhone === null) {
      result.push({
        id: "phoneChoice",
        question: "Would you like to use your saved phone number?",
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
    if (useSavedPhone !== true) result.push(phoneStep);
    if (useSavedCity !== true) result.push(cityStep);
    result.push(pickupStep);
    result.push(addressStep);
    result.push(noteStep);

    return result;
  }, [hasSavedCity, hasSavedPhone, profileLoading, useSavedCity, useSavedPhone]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [steps[currentStep].id]: value }));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/cart");
    }
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

      const profileUpdates: { city?: string; address?: string } = { city: selectedCity };
      if (saveNewAddress && formData.address) {
        profileUpdates.address = combinedDeliveryAddress;
      }
      await updateProfileMutation.mutateAsync(profileUpdates);

      const result: BulkOrderResponse = await createOrderMutation.mutateAsync({
        productIds: items.map((item) => item.product.id),
        quantities: items.map((item) => item.quantity),
        deliveryAddress: combinedDeliveryAddress,
        note: formData.notes || undefined,
        deliveryCity: selectedCity,
        pickupStore: formData.pickupStore || undefined,
      });

      if (result?.orders?.length > 0) {
        setOrderResult(result);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setPlacingOrder(false);
    }
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
      handlePlaceOrder();
    }
  };

  const handleContinueToPayment = async () => {
    if (!orderResult) return;
    setInitializingPayment(true);
    try {
      const paymentData = await initializePaymentMutation.mutateAsync({
        bulkOrderId: orderResult.orderId,
        callbackUrl: `${import.meta.env.VITE_APP_URL || window.location.origin}/track-order`,
      });
      if (paymentData?.authorizationUrl) {
        window.location.href = paymentData.authorizationUrl;
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    } finally {
      setInitializingPayment(false);
    }
  };

  const currentValue = formData[steps[currentStep]?.id] || "";
  const currentStepData = steps[currentStep];
  const selectedCity = useSavedCity ? (savedCity ?? "") : (formData.city ?? "");
  const buyerZone = getJumiaZoneForCity(selectedCity);

  const isValid =
    currentStepData?.id === "cityChoice" || currentStepData?.id === "phoneChoice"
      ? true
      : currentStepData?.required
        ? currentValue.length > 0
        : true;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // ── Order summary screen (after createOrder succeeds) ──────────────────────
  if (orderResult) {
    const subtotal = orderResult.orders.reduce(
      (s, o) => s + o.unitPrice * o.quantity,
      0,
    );

    return (
      <div className="min-h-screen w-full bg-background flex flex-col">
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container flex h-16 items-center justify-between">
            <button
              onClick={() => setOrderResult(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src={dojuLogo} alt="DOJU" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xl font-bold text-foreground">DOJU</span>
            </Link>
            <div className="w-16" />
          </div>
        </header>

        <main className="flex-1 p-4 pb-10">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="text-center pt-2 pb-1">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-doju-lime/15 mb-3">
                  <Package className="h-6 w-6 text-doju-lime" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Order Summary</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your order before proceeding to payment
                </p>
              </div>

              {/* Order items */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <ShoppingBag className="h-4 w-4 text-doju-lime" />
                  <span className="font-semibold text-sm">
                    {orderResult.orders.length} {orderResult.orders.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {orderResult.orders.map((order) => (
                    <div key={order.id} className="p-4">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                          <img
                            src={order.product.imageUrl?.[0] || "/placeholder.svg"}
                            alt={order.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                            {order.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.quantity} × {formatPrice(order.unitPrice)}
                          </p>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>
                      {/* Estimated delivery days row */}
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Truck className="h-3.5 w-3.5 shrink-0 text-doju-lime" />
                          <span>Est. delivery</span>
                        </div>
                        <span className="text-xs font-semibold text-doju-lime">
                          {order.estimatedDeliveryDays} days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery details */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-doju-lime" />
                  <span className="font-semibold text-sm">Delivery details</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground w-16 shrink-0 text-xs pt-0.5">City</span>
                  <span className="font-medium text-foreground">
                    {selectedCity}
                    {buyerZone && (
                      <span className="ml-1.5 text-xs font-normal text-doju-lime">
                        Zone {buyerZone}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground w-16 shrink-0 text-xs pt-0.5">Address</span>
                  <span className="text-foreground">{formData.address || "—"}</span>
                </div>
                {formData.pickupStore && (() => {
                  const station = buyerZone
                    ? getPickupStationsForZone(buyerZone).find((s) => s.name === formData.pickupStore)
                    : null;
                  return (
                    <div className="flex items-start gap-2 text-sm pt-1">
                      <span className="text-muted-foreground w-16 shrink-0 text-xs pt-0.5">Pickup</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-xs leading-tight">{formData.pickupStore}</p>
                        {station && (
                          <>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{station.address}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground">{station.openingHours}</span>
                            </div>
                            {station.mapUrl && (
                              <a
                                href={station.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-doju-lime mt-1 hover:opacity-80"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View on map
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
                {formData.notes && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground w-16 shrink-0 text-xs pt-0.5">Note</span>
                    <span className="text-muted-foreground italic">"{formData.notes}"</span>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-doju-lime" />
                  <span className="font-semibold text-sm">Price breakdown</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{formatPrice(orderResult.bulkDeliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Est. platform fee</span>
                    <span>{formatPrice(orderResult.bulkEstimatedPlatformFee)}</span>
                  </div>
                  <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-doju-lime">{formatPrice(orderResult.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Continue to payment */}
              <div className="pt-1 space-y-3">
                <Button
                  variant="doju-primary"
                  size="lg"
                  className="w-full gap-2 h-14 text-base"
                  onClick={handleContinueToPayment}
                  disabled={initializingPayment}
                >
                  {initializingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting to payment…
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <span className="font-normal opacity-80">·</span>
                      {formatPrice(orderResult.totalPrice)}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="text-xs">Secured by Flutterwave</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // ── Step-by-step checkout form ─────────────────────────────────────────────
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
            <img src={dojuLogo} alt="DOJU" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xl font-bold text-foreground">DOJU</span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {profileLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doju-lime mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading your information…</p>
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
                  {/* Step icon */}
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
                        <h3 className="font-semibold mb-1">Saved phone</h3>
                        <p className="text-sm text-muted-foreground">{savedPhone}</p>
                      </div>
                      <div className="flex gap-3 flex-col sm:flex-row">
                        <Button
                          variant="doju-primary"
                          className="flex-1"
                          onClick={() => {
                            setUseSavedPhone(true);
                            setFormData((prev) => ({ ...prev, phone: savedPhone ?? "" }));
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
                  ) : currentStepData.type === "pickup" ? (
                    <div className="mb-6">
                      <PickupStationSelect
                        value={currentValue}
                        onChange={(name) => handleInputChange(name)}
                        zone={buyerZone}
                      />
                      {currentValue && (() => {
                        const stations = buyerZone ? getPickupStationsForZone(buyerZone) : [];
                        const station = stations.find((s) => s.name === currentValue);
                        return station ? <PickupStationCard station={station} /> : null;
                      })()}
                    </div>
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
                          if (e.key === "Enter" && isValid) handleNext();
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
                      disabled={!isValid || placingOrder}
                      onClick={handleNext}
                    >
                      {placingOrder ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing order…
                        </span>
                      ) : currentStep === steps.length - 1 ? (
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Place Order
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    {!currentStepData.required && !placingOrder && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={handleNext}
                      >
                        Skip this step
                      </Button>
                    )}
                  </motion.div>

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

import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Progress } from "@/components/ui/progress";
import { useCart, useAppSelector } from "@/redux/hooks";
import { useCreateOrder } from "@/pages/checkout/api/use-create-orders";
import { useInitializePayment } from "@/pages/checkout/api/use-initialize-payment";
import { toast } from "sonner";
import { nigeriaStates, nigeriaCities } from "@/data/nigeria-geo";
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
} from "lucide-react";
import dojuLogo from "@/assets/doju-logo.jpg";

interface CheckoutStep {
  id: string;
  question: string;
  placeholder: string;
  type: "text" | "tel" | "textarea" | "select";
  icon: React.ReactNode;
  required: boolean;
}

const steps: CheckoutStep[] = [
  {
    id: "phone",
    question: "What's the best number to reach you?",
    placeholder: "+234 800 000 0000",
    type: "tel",
    icon: <Phone className="h-6 w-6" />,
    required: true,
  },
  {
    id: "stateCode",
    question: "Select your state",
    placeholder: "Choose your state",
    type: "select",
    icon: <MapPin className="h-6 w-6" />,
    required: true,
  },
  {
    id: "city",
    question: "Select your city",
    placeholder: "Choose your city",
    type: "select",
    icon: <MapPin className="h-6 w-6" />,
    required: true,
  },
  {
    id: "address",
    question: "What's your street address?",
    placeholder: "House number, street, area",
    type: "text",
    icon: <MapPin className="h-6 w-6" />,
    required: true,
  },
  {
    id: "notes",
    question: "Anything else you want us to know?",
    placeholder:
      "Special delivery instructions, gate codes, landmarks... (optional)",
    type: "textarea",
    icon: <MessageSquare className="h-6 w-6" />,
    required: false,
  },
];

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

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const user = useAppSelector((state) => state.authData.user);
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

  useEffect(() => {
    if (items.length === 0 && !isComplete) {
      navigate("/cart");
    }
  }, [items.length, isComplete, navigate]);

  const shipping = totalAmount > 50000 ? 0 : 2500;
  // tax has been removed per requirement
  const total = totalAmount + shipping; // no tax added

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
    if (step.required && !formData[step.id]) return;

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
    if (steps[currentStep].id === "stateCode") {
      setFormData((prev) => ({
        ...prev,
        stateCode: value,
        city: "",
      }));
      return;
    }

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
      const combinedDeliveryAddress = [
        formData.address,
        formData.city,
        selectedStateName,
      ]
        .filter(Boolean)
        .join(", ");

      // Step 1: Create bulk order via API
      const result: BulkOrderResponse = await createOrderMutation.mutateAsync({
        productIds: items.map((item) => item.product.id),
        quantities: items.map((item) => item.quantity),
        deliveryAddress: combinedDeliveryAddress,
        note: formData.notes || undefined,
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
  const selectedState = nigeriaStates.find(
    (state) => state.isoCode === formData.stateCode,
  );
  const selectedStateName = selectedState?.name || "";
  const cityOptions = useMemo(
    () => (formData.stateCode ? (nigeriaCities[formData.stateCode] ?? []) : []),
    [formData.stateCode],
  );
  const isValid = currentStepData?.required ? currentValue.length > 0 : true;
  const canSelectCurrentStep =
    currentStepData?.id !== "city" || Boolean(formData.stateCode);
  const reviewDeliveryAddress = [
    formData.address,
    formData.city,
    selectedStateName,
  ]
    .filter(Boolean)
    .join(", ");

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
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
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
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="rounded-xl border border-border bg-card p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-doju-lime" />
                  <h2 className="font-semibold text-foreground">Delivery</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {reviewDeliveryAddress}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.phone}
                </p>
                {formData.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{formData.notes}"
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="rounded-xl border border-border bg-card p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-doju-lime" />
                  <h2 className="font-semibold text-foreground">Payment</h2>
                </div>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-muted/50">
                  <CreditCard className="h-4 w-4 text-doju-lime" />
                  <span className="text-sm text-foreground">
                    Pay via Paystack
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {/* tax removed */}
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-doju-lime">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                variant="doju-primary"
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-doju-navy"></div>
                    Processing...
                  </div>
                ) : (
                  `Confirm & Pay ${formatPrice(total)}`
                )}
              </Button>

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

              {currentStepData.type === "textarea" ? (
                <Textarea
                  placeholder={currentStepData.placeholder}
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg min-h-[120px] mb-6"
                  autoFocus
                />
              ) : currentStepData.type === "select" ? (
                <select
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-3 text-base md:text-lg h-14 mb-6"
                  autoFocus
                  disabled={!canSelectCurrentStep}
                >
                  <option value="" disabled>
                    {canSelectCurrentStep
                      ? currentStepData.placeholder
                      : "Please select state first"}
                  </option>
                  {(currentStepData.id === "stateCode"
                    ? nigeriaStates.map((state) => ({
                        label: state.name,
                        value: state.isoCode,
                      }))
                    : cityOptions.map((city) => ({
                        label: city,
                        value: city,
                      }))
                  ).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={currentStepData.type}
                  placeholder={currentStepData.placeholder}
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg h-14 mb-6"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValid) {
                      handleNext();
                    }
                  }}
                />
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
        </div>
      </main>
    </div>
  );
};

export default Checkout;

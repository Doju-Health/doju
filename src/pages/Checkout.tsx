import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ArrowRight, Check, Phone, MapPin, CreditCard, MessageSquare, ShoppingBag, Shield, Landmark, Copy, CheckCircle, Package } from 'lucide-react';
import dojuLogo from '@/assets/doju-logo.jpg';

type PaymentMethod = 'card' | 'bank_transfer' | null;

interface CheckoutStep {
  id: string;
  question: string;
  placeholder: string;
  type: 'text' | 'tel' | 'textarea' | 'payment';
  icon: React.ReactNode;
  required: boolean;
}

const steps: CheckoutStep[] = [
  { 
    id: 'phone', 
    question: "What's the best number to reach you?", 
    placeholder: "+234 800 000 0000", 
    type: 'tel',
    icon: <Phone className="h-6 w-6" />,
    required: true,
  },
  { 
    id: 'address', 
    question: "Where should we deliver your order?", 
    placeholder: "Enter your full delivery address", 
    type: 'text',
    icon: <MapPin className="h-6 w-6" />,
    required: true,
  },
  { 
    id: 'payment', 
    question: "How would you like to pay?", 
    placeholder: "Card number", 
    type: 'payment',
    icon: <CreditCard className="h-6 w-6" />,
    required: true,
  },
  { 
    id: 'notes', 
    question: "Anything else you want us to know?", 
    placeholder: "Special delivery instructions, gate codes, landmarks... (optional)", 
    type: 'textarea',
    icon: <MessageSquare className="h-6 w-6" />,
    required: false,
  },
];

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showReview, setShowReview] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Generate unique 5-digit delivery code
  const deliveryCode = useMemo(() => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }, []);

  const shipping = totalAmount > 50000 ? 0 : 2500;
  const tax = totalAmount * 0.075;
  const total = totalAmount + shipping + tax;

  const progress = showReview 
    ? 100 
    : ((currentStep + 1) / (steps.length + 1)) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.id === 'payment' && !paymentMethod) return;
    if (step.required && step.type !== 'payment' && !formData[step.id]) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/cart');
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [steps[currentStep].id]: value,
    }));
  };

  const handlePlaceOrder = () => {
    setIsComplete(true);
    clearCart();
  };

  const copyDeliveryCode = () => {
    navigator.clipboard.writeText(deliveryCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const currentValue = formData[steps[currentStep]?.id] || '';
  const currentStepData = steps[currentStep];
  const isValid = currentStepData?.id === 'payment' 
    ? paymentMethod !== null 
    : (currentStepData?.required ? currentValue.length > 0 : true);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Generate order ID
  const orderId = useMemo(() => {
    return `DJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }, []);

  // Order complete screen with delivery code
  if (isComplete) {
    // Create order data to pass to tracking page
    const orderData = {
      id: orderId,
      deliveryCode,
      phone: formData.phone,
      address: formData.address,
      items: items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0] || '/placeholder.svg',
      })),
      total,
      createdAt: new Date().toISOString(),
    };

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={dojuLogo} alt="DOJU" className="h-8 w-8 rounded-full object-cover" />
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
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
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
              Thank you for shopping with DOJU. Your order is confirmed and we'll start processing it right away.
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
                <h3 className="font-semibold text-foreground">Your 5-Digit Order Code</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share this code with the delivery driver to confirm receipt
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1.5">
                  {deliveryCode.split('').map((digit, i) => (
                    <motion.span 
                      key={i}
                      className="w-12 h-14 md:w-14 md:h-16 flex items-center justify-center bg-card border-2 border-doju-lime rounded-xl text-2xl md:text-3xl font-bold text-foreground shadow-sm"
                      initial={{ scale: 0, rotateY: 180 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                    >
                      {digit}
                    </motion.span>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={copyDeliveryCode}
                >
                  {codeCopied ? (
                    <CheckCircle className="h-5 w-5 text-doju-lime" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Order ID: <span className="font-medium">{orderId}</span>
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
                to="/order-tracking" 
                state={{ orderData }}
                className="block"
              >
                <Button variant="doju-primary" size="xl" className="w-full gap-2">
                  <Package className="h-5 w-5" />
                  Track Order
                </Button>
              </Link>
              <Link to="/marketplace" className="block">
                <Button variant="doju-outline" size="xl" className="w-full gap-2">
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

  // Empty cart redirect
  if (items.length === 0 && !isComplete) {
    navigate('/cart');
    return null;
  }

  // Order review screen
  if (showReview) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-between">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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

        <main className="flex-1 p-4">
          <div className="max-w-lg mx-auto">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Progress value={100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">Review your order</p>
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
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
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
                <p className="text-sm text-muted-foreground">{formData.address}</p>
                <p className="text-sm text-muted-foreground mt-1">{formData.phone}</p>
                {formData.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{formData.notes}"</p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="rounded-xl border border-border bg-card p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-doju-lime" />
                  <h2 className="font-semibold text-foreground">Payment</h2>
                </div>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-muted/50">
                  {paymentMethod === 'card' ? (
                    <>
                      <CreditCard className="h-4 w-4 text-doju-lime" />
                      <span className="text-sm text-foreground">Card Payment</span>
                    </>
                  ) : (
                    <>
                      <Landmark className="h-4 w-4 text-doju-lime" />
                      <span className="text-sm text-foreground">Bank Transfer</span>
                    </>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatPrice(tax)}</span>
                  </div>
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
              >
                Confirm & Pay {formatPrice(total)}
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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

              {/* Payment method selection */}
              {currentStepData.type === 'payment' ? (
                <div className="space-y-4 mb-6">
                  <motion.button
                    type="button"
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'card' 
                        ? 'border-doju-lime bg-doju-lime/10' 
                        : 'border-border bg-card hover:border-doju-lime/50'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'card' ? 'bg-doju-lime text-doju-navy' : 'bg-muted text-muted-foreground'
                    }`}>
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">Card Payment</p>
                      <p className="text-sm text-muted-foreground">Pay with debit or credit card</p>
                    </div>
                    {paymentMethod === 'card' && (
                      <Check className="h-5 w-5 text-doju-lime" />
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-doju-lime bg-doju-lime/10' 
                        : 'border-border bg-card hover:border-doju-lime/50'
                    }`}
                    onClick={() => setPaymentMethod('bank_transfer')}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'bank_transfer' ? 'bg-doju-lime text-doju-navy' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Transfer directly to our account</p>
                    </div>
                    {paymentMethod === 'bank_transfer' && (
                      <Check className="h-5 w-5 text-doju-lime" />
                    )}
                  </motion.button>

                  {/* Card details if card selected */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2"
                    >
                      <Input
                        type="text"
                        placeholder="Card number"
                        className="h-12"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          className="h-12"
                        />
                        <Input
                          type="text"
                          placeholder="CVV"
                          className="h-12"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Bank transfer info if selected */}
                  {paymentMethod === 'bank_transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-muted/50 border border-border"
                    >
                      <p className="text-sm text-muted-foreground mb-2">Transfer to:</p>
                      <p className="font-semibold text-foreground">DOJU Medical Supplies</p>
                      <p className="text-sm text-foreground">Bank: First Bank Nigeria</p>
                      <p className="text-sm text-foreground">Account: 0123456789</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Order will be processed after payment confirmation
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : currentStepData.type === 'textarea' ? (
                <Textarea
                  placeholder={currentStepData.placeholder}
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg min-h-[120px] mb-6"
                  autoFocus
                />
              ) : (
                <Input
                  type={currentStepData.type}
                  placeholder={currentStepData.placeholder}
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg h-14 mb-6"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid) {
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
                  {currentStep === steps.length - 1 ? 'Review Order' : 'Continue'}
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
                      index <= currentStep ? 'bg-doju-lime' : 'bg-muted'
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

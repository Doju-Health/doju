import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Search, Package, Truck, CheckCircle, Clock, 
  MapPin, Phone, Calendar, ArrowRight, Shield
} from 'lucide-react';

interface OrderStatus {
  id: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  phone: string;
  deliveryCode: string;
  createdAt: string;
  estimatedDelivery: string;
  timeline: { status: string; date: string; completed: boolean }[];
}

// Mock order data for demonstration
const mockOrders: Record<string, OrderStatus> = {
  'DJ-ABC123XYZ': {
    id: 'DJ-ABC123XYZ',
    status: 'out_for_delivery',
    items: [
      { name: 'Classic Stethoscope III', quantity: 1, price: 85000 },
      { name: 'Automatic BP Monitor', quantity: 2, price: 52000 },
    ],
    total: 189000,
    address: '15 Marina Street, Lagos Island, Lagos',
    phone: '+234 800 123 4567',
    deliveryCode: '47293',
    createdAt: '2026-01-07',
    estimatedDelivery: '2026-01-10',
    timeline: [
      { status: 'Order placed', date: 'Jan 7, 2026 - 2:30 PM', completed: true },
      { status: 'Processing', date: 'Jan 7, 2026 - 3:15 PM', completed: true },
      { status: 'Shipped', date: 'Jan 8, 2026 - 10:00 AM', completed: true },
      { status: 'Out for delivery', date: 'Jan 9, 2026 - 8:45 AM', completed: true },
      { status: 'Delivered', date: 'Pending', completed: false },
    ],
  },
};

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders[orderId.toUpperCase()];
      if (foundOrder) {
        setOrder(foundOrder);
        setError('');
      } else {
        setOrder(null);
        setError('Order not found. Please check your order ID and try again.');
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-5 w-5" />;
      case 'shipped': return <Package className="h-5 w-5" />;
      case 'out_for_delivery': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'out_for_delivery': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-doju-navy to-doju-navy/90 py-16 md:py-24">
          <div className="container">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div className="h-16 w-16 rounded-full bg-doju-lime/20 flex items-center justify-center">
                  <Package className="h-8 w-8 text-doju-lime" />
                </div>
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Track Your Order
              </h1>
              <p className="text-primary-foreground/80 mb-8">
                Enter your order ID to see real-time delivery updates
              </p>

              {/* Search Form */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Enter order ID (e.g., DJ-ABC123XYZ)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="h-12 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <Button
                  variant="doju-primary"
                  size="lg"
                  className="gap-2"
                  onClick={handleSearch}
                  disabled={!orderId || isSearching}
                >
                  {isSearching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Search className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Track
                    </>
                  )}
                </Button>
              </motion.div>

              {error && (
                <motion.p 
                  className="text-red-300 mt-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Order Details */}
        {order && (
          <section className="py-12 md:py-16">
            <div className="container max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Status Header */}
                <div className="rounded-2xl border border-border bg-card p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <p className="text-xl font-bold text-foreground">{order.id}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">{getStatusLabel(order.status)}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-0">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div 
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-doju-lime text-doju-navy' : 'bg-muted text-muted-foreground'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </motion.div>
                          {index < order.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-doju-lime' : 'bg-muted'}`} />
                          )}
                        </div>
                        <div className="pb-8">
                          <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.status}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-doju-lime" />
                      Delivery Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Expected: {order.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Code */}
                  <div className="rounded-2xl border-2 border-doju-lime/30 bg-doju-lime/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-doju-lime" />
                      Your Delivery Code
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share with driver to confirm receipt
                    </p>
                    <div className="flex gap-1">
                      {order.deliveryCode.split('').map((digit, i) => (
                        <motion.span 
                          key={i}
                          className="w-10 h-12 flex items-center justify-center bg-card border-2 border-doju-lime rounded-lg text-xl font-bold text-foreground"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 * i, type: 'spring' }}
                        >
                          {digit}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="rounded-2xl border border-border bg-card p-6 mt-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-doju-lime" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <p className="font-semibold text-foreground">Total</p>
                      <p className="text-xl font-bold text-doju-lime">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link to="/marketplace" className="flex-1">
                    <Button variant="doju-primary" size="lg" className="w-full gap-2">
                      Continue Shopping
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* No Order Yet */}
        {!order && !error && (
          <section className="py-16">
            <div className="container max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-muted-foreground mb-6">
                  Don't have an order yet? Start shopping now!
                </p>
                <Link to="/marketplace">
                  <Button variant="doju-outline" size="lg" className="gap-2">
                    Browse Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;

import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import AnimatedStat from '@/components/home/AnimatedStat';
import TopSellingCarousel from '@/components/home/TopSellingCarousel';
import DispatchAgentSection from '@/components/home/DispatchAgentSection';
import { categories, featuredProducts } from '@/data/mockData';
import { 
  Shield, Truck, BadgeCheck, Headphones, 
  CheckCircle, Zap, Heart, Globe, 
  ArrowRight, Star, Users, Package, ChevronLeft, ChevronRight
} from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';
import dojuLogo from '@/assets/doju-logo.jpg';
import heroHospitalBg from '@/assets/hero-hospital-bg.jpg';
import CartCheckoutBar from '@/components/cart/CartCheckoutBar';
import { useRef, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

// Top 4 products for homepage
const topProducts = featuredProducts.slice(0, 4);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const whyChooseDoju = [
    { 
      icon: Shield, 
      title: 'Trusted & Reliable', 
      description: 'Every product is certified and quality-checked. Shop with confidence knowing you\'re buying directly from DOJU.',
      color: 'bg-blue-500/10 text-blue-600'
    },
    { 
      icon: Zap, 
      title: 'Fast & Reliable', 
      description: 'Swift delivery across Nigeria. Track your order in real-time and receive updates at every step.',
      color: 'bg-yellow-500/10 text-yellow-600'
    },
    { 
      icon: Heart, 
      title: 'Healthcare First', 
      description: 'Built by healthcare professionals, for healthcare professionals. We understand your needs.',
      color: 'bg-red-500/10 text-red-600'
    },
    { 
      icon: Globe, 
      title: 'Wide Selection', 
      description: 'From diagnostics to mobility aids, find everything you need from one trusted source — DOJU.',
      color: 'bg-green-500/10 text-green-600'
    },
  ];

  const stats = [
    { value: '10K+', label: 'Products', icon: Package },
    { value: '50K+', label: 'Happy Customers', icon: Heart },
    { value: '99%', label: 'Satisfaction Rate', icon: Star },
    { value: '24/7', label: 'Support', icon: Headphones },
  ];

  const trustBadges = [
    { icon: Shield, label: 'Secure Checkout', description: 'Bank-grade encryption' },
    { icon: Truck, label: 'Nationwide Delivery', description: 'Fast & tracked shipping' },
    { icon: BadgeCheck, label: 'Quality Guarantee', description: '100% authentic products' },
    { icon: Headphones, label: 'Expert Support', description: 'Clinical guidance 24/7' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Full Background */}
        <section className="relative overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
          {/* Full-width hospital background image */}
          <div className="absolute inset-0">
            <img 
              src={heroHospitalBg} 
              alt="" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70 sm:from-background/95 sm:via-background/80 sm:to-background/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          </div>
          
          {/* Animated overlay elements - reduced on mobile */}
          <motion.div 
            className="absolute top-20 left-4 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-doju-lime/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-4 sm:right-10 w-52 h-52 sm:w-96 sm:h-96 bg-doju-navy/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="container relative z-10 py-8 sm:py-16 md:py-24 px-4 sm:px-6">
            {/* Animated Logo Section */}
            <motion.div 
              className="flex justify-center mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative"
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-doju-lime/30 rounded-full blur-xl sm:blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                <img 
                  src={dojuLogo} 
                  alt="DOJU Logo" 
                  className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full object-cover shadow-2xl border-3 sm:border-4 border-background"
                />
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-8"
                style={{ y: heroY, opacity: heroOpacity }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Badge className="bg-doju-lime/20 text-doju-lime border-doju-lime/30 mb-3 sm:mb-4 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-doju-lime" />
                    Nigeria's Trusted Medical Supply Store
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Your complete medical supply store,{' '}
                  <span className="text-doju-lime">in one app.</span>
                </motion.h1>
                
                <motion.div 
                  className="space-y-2 sm:space-y-3 max-w-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <p className="text-base sm:text-xl md:text-2xl text-foreground/90 font-medium leading-relaxed">
                    Durable medical equipment. Fast delivery. Secure payments. Expert support.
                  </p>
                  <p className="text-base sm:text-lg text-doju-lime font-semibold">
                    All from DOJU.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Link to="/marketplace" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-doju-lime text-doju-navy hover:bg-doju-lime-light font-bold gap-2 group h-12 sm:h-14 text-sm sm:text-base">
                      Buy from Us Now!
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <Link to="/seller-onboarding" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-foreground hover:bg-primary-foreground/10 font-bold gap-2 h-12 sm:h-14 text-sm sm:text-base">
                      Sell Through Us
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust indicators - horizontal scroll on mobile */}
                <motion.div 
                  className="flex flex-wrap gap-3 sm:gap-6 pt-2 sm:pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    { icon: Shield, text: 'Secure Payments' },
                    { icon: Truck, text: 'Fast Delivery' },
                    { icon: BadgeCheck, text: 'Quality Guaranteed' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-doju-lime flex-shrink-0" />
                      <span className="text-xs sm:text-sm whitespace-nowrap">{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative hidden lg:block"
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div 
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={heroImage}
                    alt="Medical equipment"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                </motion.div>

                {/* Floating stat cards */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-5 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-doju-lime-pale flex items-center justify-center">
                      <Package className="h-6 w-6 text-doju-lime" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">10K+</p>
                      <p className="text-sm text-muted-foreground">Products Available</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-xl p-5 border border-border"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">50K+</p>
                      <p className="text-sm text-muted-foreground">Happy Customers</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-card border-y border-border py-6 sm:py-8">
          <div className="container px-4 sm:px-6">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Top Selling Products - Horizontal Swipe Carousel */}
        <TopSellingCarousel topProducts={topProducts} />

        {/* Shop By Category */}
        <section className="py-12 sm:py-20 bg-card">
          <div className="container px-4 sm:px-6">
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <Badge className="mb-2 sm:mb-3 bg-doju-lime/10 text-doju-lime border-doju-lime/20 text-xs">
                  Browse Categories
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  Shop By Category
                </h2>
                <p className="text-muted-foreground mt-1.5 sm:mt-2 max-w-lg text-sm sm:text-base">
                  Explore our wide range of medical equipment for clinics, hospitals, and home care.
                </p>
              </div>
              <Link to="/marketplace">
                <Button variant="doju-outline" className="gap-2 group h-10 sm:h-11 text-sm">
                  View All Categories
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose DOJU */}
        <section className="py-12 sm:py-20 bg-card">
          <div className="container px-4 sm:px-6">
            <motion.div 
              className="text-center mb-10 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-2 sm:mb-3 bg-doju-lime/10 text-doju-lime border-doju-lime/20 text-xs">
                Why DOJU?
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Why Choose DOJU?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                We're your trusted partner in healthcare procurement — quality products, reliable service, one source.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {whyChooseDoju.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="rounded-xl sm:rounded-2xl border border-border bg-background p-5 sm:p-8 h-full transition-all duration-300 group-hover:shadow-xl group-hover:border-doju-lime/30 active:scale-[0.98]">
                    <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${item.color} flex items-center justify-center mb-4 sm:mb-6`}>
                      <item.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-doju-lime transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dispatch Agent Section */}
        <DispatchAgentSection />

        {/* Trust Section */}
        <section className="py-12 sm:py-20 bg-card">
          <div className="container px-4 sm:px-6">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Shop With Confidence
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Your safety and satisfaction are our top priorities.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl sm:rounded-2xl border border-border bg-background p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-lg hover:border-doju-lime/30 active:scale-[0.98]"
                >
                  <div className="inline-flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-doju-lime-pale text-doju-lime mb-3 sm:mb-4">
                    <badge.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">{badge.label}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-doju-navy via-doju-navy to-doju-navy-light overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 opacity-10 sm:opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          
          {/* Floating shapes - smaller on mobile */}
          <motion.div 
            className="absolute top-5 right-5 sm:top-10 sm:right-20 w-20 h-20 sm:w-40 sm:h-40 bg-doju-lime/20 rounded-full blur-xl sm:blur-2xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-5 left-5 sm:bottom-10 sm:left-20 w-32 h-32 sm:w-60 sm:h-60 bg-doju-lime/10 rounded-full blur-2xl sm:blur-3xl"
            animate={{ y: [0, 20, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          <div className="container text-center relative z-10 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.h2 
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Transform Your Healthcare Procurement?
              </motion.h2>
              <motion.p 
                className="text-base sm:text-xl text-primary-foreground/80 mb-6 sm:mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join thousands of healthcare professionals who trust DOJU for quality medical equipment.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-3 sm:gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/marketplace">
                  <Button size="lg" className="bg-doju-lime text-doju-navy hover:bg-doju-lime-light font-bold gap-2 h-12 sm:h-14 text-sm sm:text-base">
                    Buy from Us Now!
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Admin Login - positioned at the bottom */}
              <motion.div 
                className="mt-12 pt-8 border-t border-primary-foreground/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/auth?admin=true">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Login
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <CartCheckoutBar />
      <Footer />
    </div>
  );
};

export default Index;

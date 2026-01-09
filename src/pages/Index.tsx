import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import { categories, featuredProducts } from '@/data/mockData';
import { Shield, Truck, BadgeCheck, Headphones } from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';

const Index = () => {
  const trustBadges = [
    { icon: Shield, label: 'Secure checkout', description: '256-bit encryption and PCI compliant.' },
    { icon: Truck, label: 'Fast delivery', description: 'Same-day dispatch on select items.' },
    { icon: BadgeCheck, label: 'Verified sellers', description: 'Thorough vetting and documentation.' },
    { icon: Headphones, label: 'Support 24/7', description: 'Clinical-grade product guidance.' },
  ];

  const steps = [
    { number: 1, title: 'Find products', description: 'Search by category, brand, or SKU across verified listings.' },
    { number: 2, title: 'Checkout securely', description: 'Encrypted payments and multiple shipping options.' },
    { number: 3, title: 'Receive quickly', description: 'Track orders from warehouse to your door.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card border-b border-border overflow-hidden">
          <div className="container py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Trusted marketplace for medical equipment
                </motion.h1>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Shop FDA-compliant devices and supplies from verified sellers. Transparent pricing, fast delivery, and secure checkout.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/marketplace">
                    <Button variant="doju-primary" size="lg" className="group">
                      <span>Shop Featured</span>
                      <motion.span
                        className="inline-block ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </Link>
                  <Link to="/marketplace">
                    <Button variant="doju-outline" size="lg">
                      Browse Categories
                    </Button>
                  </Link>
                </motion.div>
                <motion.div 
                  className="flex flex-wrap gap-4 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge variant="secondary" className="gap-2 py-1.5 px-3">
                    <Shield className="h-4 w-4" />
                    Secure Payments
                  </Badge>
                  <Badge variant="secondary" className="gap-2 py-1.5 px-3">
                    <Truck className="h-4 w-4" />
                    Fast Delivery
                  </Badge>
                  <Badge variant="secondary" className="gap-2 py-1.5 px-3">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Suppliers
                  </Badge>
                </motion.div>
              </motion.div>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={heroImage}
                    alt="Medical equipment and healthcare professionals"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
                {/* Floating badges */}
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-4 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-doju-lime-pale flex items-center justify-center">
                      <BadgeCheck className="h-5 w-5 text-doju-lime" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">500+</p>
                      <p className="text-xs text-muted-foreground">Verified Sellers</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
                <p className="text-muted-foreground mt-1">
                  Explore essential equipment for clinics, hospitals, and home care.
                </p>
              </div>
              <Link to="/marketplace">
                <Button variant="link" className="text-doju-lime">
                  View all
                </Button>
              </Link>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((category, index) => (
                <motion.div key={category.id} variants={itemVariants} custom={index}>
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
                <p className="text-muted-foreground mt-1">
                  Top-rated picks from verified brands.
                </p>
              </div>
              <Link to="/marketplace">
                <Button variant="link" className="text-doju-lime">
                  See more
                </Button>
              </Link>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.slice(0, 4).map((product, index) => (
                <motion.div key={product.id} variants={itemVariants} custom={index}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground">Why shop with us</h2>
              <p className="text-muted-foreground mt-1">
                Reliability and safety at every step.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                  className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-doju-lime-pale text-doju-lime mb-4">
                    <badge.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-doju-navy">{badge.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground">How it works</h2>
              <p className="text-muted-foreground mt-1">
                From search to delivery in three simple steps.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.span 
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-doju-lime text-doju-navy font-bold text-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {step.number}
                    </motion.span>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-doju-navy overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: 'reverse' 
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
          <div className="container text-center relative z-10">
            <motion.h2 
              className="text-3xl font-bold text-primary-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to get started?
            </motion.h2>
            <motion.p 
              className="text-primary-foreground/80 mb-8 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of healthcare professionals who trust Doju for their medical equipment needs.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/onboarding/buyer">
                <Button variant="doju-primary" size="lg" className="group">
                  Create buyer account
                </Button>
              </Link>
              <Link to="/onboarding/seller">
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Become a seller
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

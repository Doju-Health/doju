import { Link } from 'react-router-dom';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card border-b border-border">
          <div className="container py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Trusted marketplace for medical equipment
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Shop FDA-compliant devices and supplies from verified sellers. Transparent pricing, fast delivery, and secure checkout.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/marketplace">
                    <Button variant="doju-primary" size="lg">
                      Shop Featured
                    </Button>
                  </Link>
                  <Link to="/categories">
                    <Button variant="doju-outline" size="lg">
                      Browse Categories
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
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
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={heroImage}
                    alt="Medical equipment and healthcare professionals"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
                <p className="text-muted-foreground mt-1">
                  Explore essential equipment for clinics, hospitals, and home care.
                </p>
              </div>
              <Link to="/categories">
                <Button variant="link" className="text-doju-lime">
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground">Why shop with us</h2>
              <p className="text-muted-foreground mt-1">
                Reliability and safety at every step.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-doju-lime-pale text-doju-lime mb-4">
                    <badge.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-doju-navy">{badge.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground">How it works</h2>
              <p className="text-muted-foreground mt-1">
                From search to delivery in three simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-doju-lime text-doju-navy font-bold text-sm">
                      {step.number}
                    </span>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-doju-navy">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of healthcare professionals who trust Doju for their medical equipment needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/onboarding/buyer">
                <Button variant="doju-primary" size="lg">
                  Create buyer account
                </Button>
              </Link>
              <Link to="/onboarding/seller">
                <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Become a seller
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

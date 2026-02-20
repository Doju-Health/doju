import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, Clock, Package, RefreshCw } from 'lucide-react';

const ReturnPolicy = () => {
  const policies = [
    { icon: Clock, title: '30-Day Returns', description: 'Return most items within 30 days of delivery for a full refund.' },
    { icon: Package, title: 'Original Packaging', description: 'Items must be returned in original, unopened packaging when possible.' },
    { icon: RefreshCw, title: 'Free Return Shipping', description: 'We cover return shipping costs for defective or incorrect items.' },
    { icon: CheckCircle, title: 'Quick Refunds', description: 'Refunds processed within 5-7 business days after we receive your return.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">Return Policy</h1>
            <p className="text-muted-foreground mb-8">We want you to be completely satisfied with your purchase.</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <policy.icon className="h-8 w-8 text-doju-lime mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{policy.title}</h3>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">How to Return an Item</h2>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                  <li>Log into your Doju account and go to your order history</li>
                  <li>Select the item you wish to return and click "Request Return"</li>
                  <li>Choose your reason for return and submit the request</li>
                  <li>Print the prepaid shipping label (if applicable)</li>
                  <li>Package the item securely and drop off at the designated carrier</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Non-Returnable Items</h2>
                <p className="text-muted-foreground">
                  For health and safety reasons, certain items cannot be returned once opened, including consumables, personal protective equipment, and items marked as final sale.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Damaged or Defective Items</h2>
                <p className="text-muted-foreground">
                  If you receive a damaged or defective item, contact us within 48 hours. We'll arrange a replacement or full refund at no cost to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
                <p className="text-muted-foreground">
                  For return questions, contact returns@doju.example or call +1 (555) 010-2400
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;

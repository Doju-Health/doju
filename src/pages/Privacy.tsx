import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly, including name, email, phone number, shipping address, and payment information necessary to process orders.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  Your information is used to process orders, communicate about your account, improve our services, and comply with legal obligations. We never sell your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures including 256-bit encryption for all transactions. Your data is stored on secure, PCI-compliant servers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to access, correct, or delete your personal information. Contact our privacy team at privacy@doju.example to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies to improve your experience and analyze site usage. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
                <p className="text-muted-foreground">
                  For privacy-related questions, contact privacy@doju.example
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

export default Privacy;

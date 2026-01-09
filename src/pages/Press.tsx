import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { FileText, Download, Mail } from 'lucide-react';

const Press = () => {
  const articles = [
    { title: 'Doju Raises Series A to Expand Medical Equipment Marketplace', source: 'TechCrunch', date: 'Jan 2026' },
    { title: 'How Doju is Transforming Healthcare Supply Chains', source: 'Forbes Africa', date: 'Dec 2025' },
    { title: 'The Future of Medical Equipment Distribution', source: 'Healthcare Weekly', date: 'Nov 2025' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-doju-navy">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Press & Media
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Latest news, press releases, and media resources.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <FileText className="h-8 w-8 text-doju-lime mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Press Kit</h3>
                <p className="text-sm text-muted-foreground mb-4">Download logos, brand guidelines, and company information.</p>
                <Button variant="doju-outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Kit
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <Mail className="h-8 w-8 text-doju-lime mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Media Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-4">For press inquiries, interviews, or media requests.</p>
                <Button variant="doju-primary" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact PR Team
                </Button>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-foreground mb-8"
            >
              Recent Coverage
            </motion.h2>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <h3 className="font-semibold text-foreground group-hover:text-doju-lime transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-sm text-doju-lime">{article.source}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Press;

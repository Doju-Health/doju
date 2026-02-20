import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Heart, Users, Award } from 'lucide-react';

const About = () => {
  const values = [
    { icon: Shield, title: 'Trust & Safety', description: 'Every product verified, every seller vetted.' },
    { icon: Heart, title: 'Healthcare First', description: 'Supporting medical professionals worldwide.' },
    { icon: Users, title: 'Community Driven', description: 'Built by healthcare workers, for healthcare workers.' },
    { icon: Award, title: 'Quality Assured', description: 'Only FDA-compliant, certified equipment.' },
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
                About Doju
              </h1>
              <p className="text-xl text-primary-foreground/80">
                We're on a mission to make quality medical equipment accessible to healthcare providers everywhere.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2024, Doju started with a simple observation: healthcare professionals struggled to find reliable, quality medical equipment from trusted sources.
                </p>
                <p className="text-muted-foreground">
                  Today, we connect thousands of verified sellers with healthcare providers, ensuring every transaction is secure, transparent, and backed by our quality guarantee.
                </p>
              </div>
              <div className="rounded-2xl bg-muted aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Team Photo</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-foreground text-center mb-12"
            >
              Our Values
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-doju-lime-pale text-doju-lime mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
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

export default About;

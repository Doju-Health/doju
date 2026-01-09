import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const Careers = () => {
  const openings = [
    { title: 'Senior Frontend Engineer', location: 'Remote', type: 'Full-time', department: 'Engineering' },
    { title: 'Product Designer', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Design' },
    { title: 'Customer Success Manager', location: 'Remote', type: 'Full-time', department: 'Support' },
    { title: 'Medical Equipment Specialist', location: 'Remote', type: 'Contract', department: 'Operations' },
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
                Join Our Team
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Help us revolutionize how healthcare professionals access medical equipment.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-foreground mb-8"
            >
              Open Positions
            </motion.h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-doju-lime font-medium">{job.department}</span>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-doju-lime transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="doju-primary">Apply Now</Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center p-8 rounded-xl bg-muted/50"
            >
              <h3 className="font-semibold text-foreground mb-2">Don't see a role for you?</h3>
              <p className="text-muted-foreground mb-4">We're always looking for talented people. Send us your resume!</p>
              <Button variant="doju-outline">Send Resume</Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, ArrowRight, DollarSign, MapPin, Clock } from 'lucide-react';

const DispatchAgentSection = () => {
  const benefits = [
    { icon: DollarSign, text: 'Earn per delivery' },
    { icon: MapPin, text: 'Work in your area' },
    { icon: Clock, text: 'Flexible schedule' },
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-doju-navy to-doju-navy-light relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute top-10 right-10 w-72 h-72 bg-doju-lime/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 left-10 w-96 h-96 bg-doju-lime/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-3 bg-doju-lime/20 text-doju-lime border-doju-lime/30 text-xs">
                <Truck className="h-3 w-3 mr-1" />
                Join Our Team
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Become a Dispatch Agent
              </h2>
              <p className="text-lg sm:text-xl text-primary-foreground/90 font-medium mb-2">
                Earn money delivering orders in your area
              </p>
              <p className="text-primary-foreground/70 text-sm sm:text-base">
                Join our dispatch network and get paid for delivering orders from sellers to buyers. 
                Work on your own schedule, use your own vehicle, and earn extra income.
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2"
                >
                  <benefit.icon className="h-4 w-4 text-doju-lime" />
                  <span className="text-sm text-primary-foreground">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/dispatch/register">
                <Button 
                  size="lg" 
                  className="bg-doju-lime text-doju-navy hover:bg-doju-lime-light font-bold gap-2 group h-12 sm:h-14 text-sm sm:text-base"
                >
                  Register as a Dispatch Agent
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <motion.div
                className="bg-card/10 backdrop-blur-sm rounded-3xl border border-primary-foreground/10 p-8"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <motion.div
                      className="h-32 w-32 rounded-full bg-doju-lime/20 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Truck className="h-16 w-16 text-doju-lime" />
                    </motion.div>
                    
                    {/* Animated rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-doju-lime/30"
                      animate={{ 
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-doju-lime/30"
                      animate={{ 
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-primary-foreground/90 text-lg font-medium">
                    Fast & Reliable Delivery
                  </p>
                  <p className="text-primary-foreground/60 text-sm mt-1">
                    Be part of our growing network
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { value: '50+', label: 'Active Agents' },
                    { value: '1000+', label: 'Deliveries' },
                    { value: '4.9', label: 'Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-xl font-bold text-doju-lime">{stat.value}</p>
                      <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-doju-lime rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <DollarSign className="h-6 w-6 text-doju-navy" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-xl border border-border"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <MapPin className="h-6 w-6 text-doju-lime" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DispatchAgentSection;

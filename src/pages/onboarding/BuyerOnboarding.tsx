import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';

interface OnboardingStep {
  question: string;
  placeholder: string;
  field: string;
  type: string;
}

const steps: OnboardingStep[] = [
  { question: "What should we call you?", placeholder: "Your name", field: 'name', type: 'text' },
  { question: "What's your email address?", placeholder: "you@example.com", field: 'email', type: 'email' },
  { question: "What's your phone number?", placeholder: "+1 (555) 000-0000", field: 'phone', type: 'tel' },
  { question: "Create a password", placeholder: "At least 8 characters", field: 'password', type: 'password' },
];

const BuyerOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showVerification, setShowVerification] = useState(false);

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowVerification(true);
    }
  };

  const handleBack = () => {
    if (showVerification) {
      setShowVerification(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [steps[currentStep].field]: value,
    }));
  };

  const handleComplete = () => {
    navigate('/marketplace');
  };

  const currentValue = formData[steps[currentStep]?.field] || '';
  const isValid = currentValue.length > 0;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center">
            <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Progress value={100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Step 5 of 5</p>
            </div>

            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="h-20 w-20 rounded-full bg-doju-lime-pale flex items-center justify-center">
                <Mail className="h-10 w-10 text-doju-lime" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-3xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Check your inbox
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We've sent a verification link to <strong>{formData.email}</strong>. Click the link to verify your email and access the marketplace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="doju-primary" size="lg" className="w-full" onClick={handleComplete}>
                Continue to marketplace
              </Button>
            </motion.div>

            <motion.p 
              className="text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Didn't receive the email?{' '}
              <button className="text-doju-lime hover:underline">Resend</button>
            </motion.p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center">
          <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length + 1}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-foreground mb-8">
                {steps[currentStep].question}
              </h1>

              <Input
                type={steps[currentStep].type}
                placeholder={steps[currentStep].placeholder}
                value={currentValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg h-14 mb-6"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) {
                    handleNext();
                  }
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="doju-primary"
                  size="lg"
                  className="w-full"
                  disabled={!isValid}
                  onClick={handleNext}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-doju-lime' : 'bg-muted'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  />
                ))}
                <div className="h-2 w-2 rounded-full bg-muted" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default BuyerOnboarding;

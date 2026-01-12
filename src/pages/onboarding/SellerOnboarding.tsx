import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import dojuLogo from '@/assets/doju-logo.jpg';

interface OnboardingStep {
  question: string;
  placeholder: string;
  field: string;
  type: string;
}

const steps: OnboardingStep[] = [
  { question: "What's your business name?", placeholder: "Your company name", field: 'businessName', type: 'text' },
  { question: "What's your business email?", placeholder: "business@company.com", field: 'businessEmail', type: 'email' },
  { question: "What's your business phone number?", placeholder: "+234 800 000 0000", field: 'businessPhone', type: 'tel' },
  { question: "What's your street address?", placeholder: "123 Market Street", field: 'streetAddress', type: 'text' },
  { question: "What area or neighborhood?", placeholder: "Victoria Island", field: 'area', type: 'text' },
  { question: "What city are you located in?", placeholder: "Lagos", field: 'city', type: 'text' },
  { question: "What state?", placeholder: "Lagos State", field: 'state', type: 'text' },
];

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - save data and assign seller role
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    if (!user) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update profile with business information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: formData.businessName,
          email: formData.businessEmail,
          phone: formData.businessPhone,
          street_address: formData.streetAddress,
          area: formData.area,
          city: formData.city,
          state: formData.state,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Assign seller role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'seller'
        });

      if (roleError && !roleError.message.includes('duplicate')) {
        throw roleError;
      }

      toast.success('Your seller account is ready!');
      setIsComplete(true);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete onboarding', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
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

  const currentValue = formData[steps[currentStep]?.field] || '';
  const isValid = currentValue.length > 0;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={dojuLogo} alt="DOJU" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-xl font-bold text-foreground">DOJU</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="h-20 w-20 rounded-full bg-doju-lime flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-doju-navy" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-3xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to DOJU, {formData.businessName}!
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your seller account is ready. Start uploading your products and reach thousands of healthcare professionals across Nigeria.
            </motion.p>

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="doju-primary" 
                size="lg" 
                className="w-full gap-2"
                onClick={() => {
                  // Force page reload to refresh auth context
                  window.location.href = '/seller/dashboard';
                }}
              >
                <Store className="h-5 w-5" />
                Go to Seller Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to home
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src={dojuLogo} alt="DOJU" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xl font-bold text-foreground">DOJU</span>
          </Link>
          <div className="w-16" />
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
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Step {currentStep + 1} of {totalSteps}
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
              {/* Step Icon */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-16 w-16 rounded-full bg-doju-lime/20 flex items-center justify-center text-doju-lime">
                  <Store className="h-6 w-6" />
                </div>
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
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
                  if (e.key === 'Enter' && isValid && !isSubmitting) {
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
                  disabled={!isValid || isSubmitting}
                  onClick={handleNext}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-doju-navy" />
                  ) : currentStep === steps.length - 1 ? (
                    'Create Seller Account'
                  ) : (
                    'Continue'
                  )}
                  {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
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
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SellerOnboarding;

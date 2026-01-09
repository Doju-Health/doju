import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, User, Building2 } from 'lucide-react';

type UserType = 'buyer' | 'seller' | null;

interface LoginStep {
  question: string;
  placeholder: string;
  field: string;
  type: string;
}

const buyerSteps: LoginStep[] = [
  { question: "What's your email?", placeholder: "you@example.com", field: 'email', type: 'email' },
  { question: "Enter your password", placeholder: "Your password", field: 'password', type: 'password' },
];

const sellerSteps: LoginStep[] = [
  { question: "What's your business email?", placeholder: "business@company.com", field: 'email', type: 'email' },
  { question: "Enter your password", placeholder: "Your password", field: 'password', type: 'password' },
];

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const steps = userType === 'seller' ? sellerSteps : buyerSteps;
  const totalSteps = steps.length + 1; // +1 for user type selection
  const progress = userType ? ((currentStep + 2) / (totalSteps + 1)) * 100 : (1 / (totalSteps + 1)) * 100;

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (userType) {
      setUserType(null);
      setFormData({});
    } else {
      navigate('/');
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Login complete
      navigate('/marketplace');
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doju-navy">
              <span className="text-sm font-bold text-primary-foreground">DJ</span>
            </div>
            <span className="text-xl font-bold text-foreground">Doju</span>
          </Link>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Progress */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {userType ? `Step ${currentStep + 2} of ${totalSteps}` : 'Step 1 of 3'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!userType ? (
              /* User Type Selection */
              <motion.div
                key="type-select"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-3">
                    Welcome back! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    How would you like to sign in?
                  </p>
                </div>

                <motion.button
                  onClick={() => setUserType('buyer')}
                  className="w-full p-6 rounded-xl border-2 border-border bg-card hover:border-doju-lime hover:shadow-lg transition-all duration-300 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-doju-lime-pale flex items-center justify-center group-hover:bg-doju-lime transition-colors">
                      <User className="h-6 w-6 text-doju-lime group-hover:text-doju-navy transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">I'm a buyer</h3>
                      <p className="text-sm text-muted-foreground">Shop for medical equipment</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setUserType('seller')}
                  className="w-full p-6 rounded-xl border-2 border-border bg-card hover:border-doju-lime hover:shadow-lg transition-all duration-300 text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-doju-lime-pale flex items-center justify-center group-hover:bg-doju-lime transition-colors">
                      <Building2 className="h-6 w-6 text-doju-lime group-hover:text-doju-navy transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">I'm a seller</h3>
                      <p className="text-sm text-muted-foreground">Access your seller dashboard</p>
                    </div>
                  </div>
                </motion.button>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Don't have an account?{' '}
                  <Link to="/onboarding/buyer" className="text-doju-lime hover:underline">
                    Create one
                  </Link>
                </p>
              </motion.div>
            ) : (
              /* Login Steps */
              <motion.div
                key={`step-${currentStep}`}
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
                  className="text-lg h-14 mb-4"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid) {
                      handleNext();
                    }
                  }}
                />

                {currentStep === steps.length - 1 && (
                  <div className="flex justify-end mb-6">
                    <Link to="/forgot-password" className="text-sm text-doju-lime hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

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
                    {currentStep === steps.length - 1 ? 'Sign in' : 'Continue'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>

                {/* Step indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  <div className="h-2 w-2 rounded-full bg-doju-lime" />
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

                <p className="text-center text-sm text-muted-foreground mt-6">
                  {userType === 'buyer' ? (
                    <>
                      Don't have an account?{' '}
                      <Link to="/onboarding/buyer" className="text-doju-lime hover:underline">
                        Create one
                      </Link>
                    </>
                  ) : (
                    <>
                      Want to sell on Doju?{' '}
                      <Link to="/onboarding/seller" className="text-doju-lime hover:underline">
                        Apply now
                      </Link>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Store, Eye, EyeOff, Mail, Lock, Building2, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import dojuLogo from '@/assets/doju-logo.jpg';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

interface OnboardingStep {
  question: string;
  placeholder: string;
  field: string;
  type: string;
  icon: React.ElementType;
  step: number;
}

const signupSteps: OnboardingStep[] = [
  // Step 1: Business Details
  { question: "What's your business name?", placeholder: "Your company name", field: 'businessName', type: 'text', icon: Building2, step: 1 },
  { question: "What's your business address?", placeholder: "123 Market Street, Lagos", field: 'businessAddress', type: 'text', icon: MapPin, step: 1 },
  // Step 2: Contact Details
  { question: "What's your email address?", placeholder: "business@company.com", field: 'email', type: 'email', icon: Mail, step: 2 },
  { question: "What's your phone number?", placeholder: "+234 800 000 0000", field: 'phone', type: 'tel', icon: Phone, step: 2 },
  // Step 3: Security
  { question: "Create a secure password", placeholder: "At least 6 characters", field: 'password', type: 'password', icon: Lock, step: 3 },
  { question: "Confirm your password", placeholder: "Re-enter your password", field: 'confirmPassword', type: 'password', icon: Lock, step: 3 },
];

const loginSteps: OnboardingStep[] = [
  { question: "Welcome back! What's your email?", placeholder: "business@company.com", field: 'email', type: 'email', icon: Mail, step: 1 },
  { question: "Enter your password", placeholder: "Your password", field: 'password', type: 'password', icon: Lock, step: 1 },
];

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const steps = isLogin ? loginSteps : signupSteps;
  const totalStepCount = isLogin ? 1 : 3;
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Check if user is already logged in as seller
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if they have seller role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        
        if (roles?.some(r => r.role === 'seller')) {
          navigate('/seller/dashboard');
        }
      }
    };
    checkExistingSession();
  }, [navigate]);

  const validateCurrentStep = (): boolean => {
    const value = formData[currentStep.field] || '';
    setError('');

    if (!value.trim()) {
      setError('This field is required');
      return false;
    }

    if (currentStep.field === 'email') {
      try {
        emailSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e.errors[0].message);
          return false;
        }
      }
    }

    if (currentStep.field === 'password') {
      try {
        passwordSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e.errors[0].message);
          return false;
        }
      }
    }

    if (currentStep.field === 'confirmPassword') {
      if (value !== formData.password) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Create the user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/seller/dashboard`,
          data: {
            full_name: formData.businessName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
          return;
        }
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // Create/update profile with business information
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.user.id,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          street_address: formData.businessAddress,
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // Assign seller role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'seller'
        });

      if (roleError && !roleError.message.includes('duplicate')) {
        console.error('Role error:', roleError);
      }

      toast.success('Your seller account is ready!');
      setIsComplete(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (!data.user) {
        setError('Failed to sign in');
        return;
      }

      // Check if user has seller role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      const hasSeller = roles?.some(r => r.role === 'seller');

      if (!hasSeller) {
        // Assign seller role if not already a seller
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'seller'
          });
      }

      toast.success('Welcome back!');
      // Force reload to refresh auth context
      window.location.href = '/seller/dashboard';
    } catch (error: any) {
      console.error('Signin error:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Final step - submit
      if (isLogin) {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStep.field]: value,
    }));
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCurrentStepIndex(0);
    setFormData({});
    setError('');
  };

  const currentValue = formData[currentStep?.field] || '';
  const isValid = currentValue.length > 0;
  const isPasswordField = currentStep?.type === 'password';

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
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
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
          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'Seller Sign In' : 'Become a DOJU Seller'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin ? 'Access your seller dashboard' : 'Join our network of trusted medical suppliers'}
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {isLogin ? 'Sign In' : `Step ${currentStep.step} of ${totalStepCount}`}
              </span>
              <span className="text-sm font-medium text-doju-lime">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Step Labels */}
            {!isLogin && (
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className={currentStep.step >= 1 ? 'text-doju-lime font-medium' : ''}>Business</span>
                <span className={currentStep.step >= 2 ? 'text-doju-lime font-medium' : ''}>Contact</span>
                <span className={currentStep.step >= 3 ? 'text-doju-lime font-medium' : ''}>Security</span>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${isLogin}-${currentStepIndex}`}
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
                  {currentStep && <currentStep.icon className="h-7 w-7" />}
                </div>
              </motion.div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                {currentStep?.question}
              </h1>

              <div className="relative">
                <Input
                  type={isPasswordField && !showPassword ? 'password' : isPasswordField ? 'text' : currentStep?.type}
                  placeholder={currentStep?.placeholder}
                  value={currentValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg h-14 mb-2 pr-12"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid && !isSubmitting) {
                      handleNext();
                    }
                  }}
                />
                {isPasswordField && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
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
                  ) : currentStepIndex === steps.length - 1 ? (
                    isLogin ? 'Sign In' : 'Create Seller Account'
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
                      index <= currentStepIndex ? 'bg-doju-lime' : 'bg-muted'
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: index === currentStepIndex ? 1.2 : 1 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Toggle Sign In / Sign Up */}
          <motion.div 
            className="mt-8 pt-6 border-t border-border text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              {isLogin ? "New to DOJU? " : 'Already have an account? '}
              <button
                onClick={toggleMode}
                className="text-doju-lime font-semibold hover:underline"
              >
                {isLogin ? 'Create a seller account' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SellerOnboarding;

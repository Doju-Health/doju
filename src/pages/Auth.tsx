import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ArrowRight, Shield, Eye, EyeOff, Check } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

interface Step {
  id: string;
  question: string;
  placeholder: string;
  type: 'text' | 'email' | 'password';
  field: string;
}

const signUpSteps: Step[] = [
  {
    id: 'name',
    question: "Hi there! What should we call you?",
    placeholder: "Your name",
    type: 'text',
    field: 'fullName'
  },
  {
    id: 'email',
    question: "Great to meet you! What's your email address?",
    placeholder: "you@example.com",
    type: 'email',
    field: 'email'
  },
  {
    id: 'password',
    question: "Almost there! Create a secure password",
    placeholder: "At least 6 characters",
    type: 'password',
    field: 'password'
  }
];

const signInSteps: Step[] = [
  {
    id: 'email',
    question: "Welcome back! What's your email?",
    placeholder: "you@example.com",
    type: 'email',
    field: 'email'
  },
  {
    id: 'password',
    question: "And your password?",
    placeholder: "Enter your password",
    type: 'password',
    field: 'password'
  }
];

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminLogin = searchParams.get('admin') === 'true';
  const returnTo = searchParams.get('returnTo');
  
  const { user, signIn, signUp, loading, isAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = isLogin ? signInSteps : signUpSteps;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (returnTo) {
        navigate(returnTo);
      } else {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, navigate, returnTo]);

  const validateCurrentStep = () => {
    const value = formData[currentStepData.field as keyof typeof formData];
    
    if (!value.trim()) {
      setError('This field is required');
      return false;
    }

    if (currentStepData.field === 'email') {
      try {
        emailSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e.errors[0].message);
          return false;
        }
      }
    }

    if (currentStepData.field === 'password') {
      try {
        passwordSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e.errors[0].message);
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = async () => {
    setError('');
    
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      // Submit the form
      setIsSubmitting(true);
      try {
        if (isLogin) {
          const { error } = await signIn(formData.email, formData.password);
          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              setError('Invalid email or password. Please try again.');
            } else {
              setError(error.message);
            }
          }
        } else {
          const { error } = await signUp(formData.email, formData.password, formData.fullName);
          if (error) {
            if (error.message.includes('already registered')) {
              setError('This email is already registered. Please sign in instead.');
            } else {
              setError(error.message);
            }
          }
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(0);
    setFormData({ fullName: '', email: '', password: '' });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doju-lime"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 md:p-10">
            {/* Admin Badge */}
            {isAdminLogin && (
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 bg-doju-navy text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Admin Access
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-medium text-doju-lime">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                      index <= currentStep ? 'bg-doju-lime' : 'bg-muted'
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1 : 0.95
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${isLogin}-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {currentStepData.question}
                </h1>

                {/* Input */}
                <div className="relative">
                  <Input
                    type={currentStepData.type === 'password' && !showPassword ? 'password' : currentStepData.type === 'password' ? 'text' : currentStepData.type}
                    placeholder={currentStepData.placeholder}
                    value={formData[currentStepData.field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-14 text-lg px-4 pr-12 rounded-xl border-2 focus:border-doju-lime transition-colors"
                    autoFocus
                  />
                  {currentStepData.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="doju-primary"
                    size="lg"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-doju-navy"></div>
                    ) : isLastStep ? (
                      <>
                        <Check className="h-5 w-5" />
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Toggle Mode */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                {isLogin ? "New to DOJU? " : 'Already have an account? '}
                <button
                  onClick={toggleMode}
                  className="text-doju-lime font-semibold hover:underline"
                >
                  {isLogin ? 'Create an account' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Forgot Password */}
            {isLogin && currentStepData.field === 'password' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;

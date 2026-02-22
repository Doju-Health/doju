import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { z } from "zod";
import { useRegister } from "./api/use-register";
import { useVerifyEmail } from "./api/use-verify-email";
import { useLogin } from "./api/use-login";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

interface Step {
  id: string;
  question: string;
  placeholder: string;
  type: "text" | "email" | "password" | "role";
  field: string;
}

const signUpSteps: Step[] = [
  {
    id: "name",
    question: "Hi there! What should we call you?",
    placeholder: "Your name",
    type: "text",
    field: "fullName",
  },
  {
    id: "role",
    question: "What brings you to DOJU?",
    placeholder: "",
    type: "role",
    field: "role",
  },
  {
    id: "email",
    question: "Great! What's your email address?",
    placeholder: "you@example.com",
    type: "email",
    field: "email",
  },
  {
    id: "phone",
    question: "How can we reach you?",
    placeholder: "+234 (0) XXX XXX XXXX",
    type: "text",
    field: "phoneNumber",
  },
  {
    id: "password",
    question: "Create a secure password",
    placeholder: "At least 6 characters",
    type: "password",
    field: "password",
  },
];

const signInSteps: Step[] = [
  {
    id: "email",
    question: "Welcome back! What's your email?",
    placeholder: "you@example.com",
    type: "email",
    field: "email",
  },
  {
    id: "password",
    question: "And your password?",
    placeholder: "Enter your password",
    type: "password",
    field: "password",
  },
];

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate, isPending } = useRegister();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "" as "buyer" | "seller" | "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const steps = isLogin ? signInSteps : signUpSteps;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const validateCurrentStep = () => {
    const value = formData[currentStepData.field as keyof typeof formData];

    if (currentStepData.field === "role") {
      if (!value) {
        setError("Please select a role to continue");
        return false;
      }
      return true;
    }

    if (!value.toString().trim()) {
      setError("This field is required");
      return false;
    }

    if (currentStepData.field === "email") {
      try {
        emailSchema.parse(value);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(e.errors[0].message);
          return false;
        }
      }
    }

    if (currentStepData.field === "password") {
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
    setError("");

    if (!validateCurrentStep()) return;

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        if (isLogin) {
          // Handle login
          login(
            {
              email: formData.email,
              password: formData.password,
              role: "seller",
            },
            {
              onSuccess: () => {
                setIsSubmitting(false);
                // Navigate after successful login
                setTimeout(() => {
                  navigate("/");
                }, 1000);
              },
              onError: () => {
                setIsSubmitting(false);
              },
            },
          );
        } else {
          // Handle registration
          // Ensure role is valid before submitting
          if (!formData.role || !["buyer", "seller"].includes(formData.role)) {
            setError("Please select a valid role");
            setIsSubmitting(false);
            return;
          }

          // First, register the user (which should send OTP)
          mutate(
            {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              role: formData.role as "buyer" | "seller",
              phoneNumber: formData.phoneNumber,
            },
            {
              onSuccess: () => {
                // Show OTP modal after successful registration
                setShowOtpModal(true);
                setIsSubmitting(false);
              },
              onError: () => {
                setIsSubmitting(false);
              },
            },
          );
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentStepData.field]: value,
    }));
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(0);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "",
      phoneNumber: "",
    });
    setError("");
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    setOtpError("");
    verifyEmail(
      { email: formData.email, otp },
      {
        onSuccess: () => {
          setShowOtpModal(false);
          navigate("/auth");
        },
        onError: () => {
          setOtpError("Invalid OTP. Please try again.");
          setOtp("");
        },
      },
    );
  };

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
                      index <= currentStep ? "bg-doju-lime" : "bg-muted"
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1 : 0.95,
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

                {/* Role Selection */}
                {currentStepData.type === "role" ? (
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          role: "buyer",
                        }));
                        setError("");
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                        formData.role === "buyer"
                          ? "border-doju-lime bg-doju-lime/5"
                          : "border-border hover:border-doju-lime/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg">Buy Products</p>
                          <p className="text-sm text-muted-foreground">
                            Browse and purchase products
                          </p>
                        </div>
                        {formData.role === "buyer" && (
                          <Check className="h-6 w-6 text-doju-lime" />
                        )}
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          role: "seller",
                        }));
                        setError("");
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                        formData.role === "seller"
                          ? "border-doju-lime bg-doju-lime/5"
                          : "border-border hover:border-doju-lime/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg">Sell Products</p>
                          <p className="text-sm text-muted-foreground">
                            Grow your business with us
                          </p>
                        </div>
                        {formData.role === "seller" && (
                          <Check className="h-6 w-6 text-doju-lime" />
                        )}
                      </div>
                    </motion.button>
                  </div>
                ) : (
                  /* Standard Input */
                  <div className="relative">
                    <Input
                      type={
                        currentStepData.type === "password" && !showPassword
                          ? "password"
                          : currentStepData.type === "password"
                            ? "text"
                            : currentStepData.type
                      }
                      placeholder={currentStepData.placeholder}
                      value={
                        formData[currentStepData.field as keyof typeof formData]
                      }
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-14 text-lg px-4 pr-12 rounded-xl border-2 focus:border-doju-lime transition-colors"
                      autoFocus
                    />
                    {currentStepData.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                )}

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
                    disabled={isSubmitting || isLoggingIn}
                    className="flex-1 gap-2"
                  >
                    {isSubmitting || isLoggingIn ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-doju-navy"></div>
                    ) : isLastStep ? (
                      <>
                        <Check className="h-5 w-5" />
                        {isLogin ? "Sign In" : "Create Account"}
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
                {isLogin ? "New to DOJU? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-doju-lime font-semibold hover:underline"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Forgot Password */}
            {isLogin && currentStepData.field === "password" && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Verify Your Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              We've sent a 6-digit OTP to{" "}
              <span className="font-semibold text-foreground">
                {formData.email}
              </span>
            </p>

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleVerifyOtp();
                  }
                }}
                maxLength={6}
                className="h-14 text-2xl tracking-widest text-center font-bold"
                autoFocus
              />
              {otpError && (
                <p className="text-destructive text-sm font-medium">
                  {otpError}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setOtpError("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="doju-primary"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otp.length < 6}
                className="flex-1"
              >
                {isVerifying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code?{" "}
              <button className="text-doju-lime font-semibold hover:underline">
                Resend OTP
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Auth;

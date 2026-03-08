import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { ArrowLeft, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { useResetPassword } from "./Auth/api/use-reset-password";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useResetPassword();

  // prefill email/otp from query params if present
  useEffect(() => {
    const e = searchParams.get("email");
    const o = searchParams.get("otp");
    if (e) setEmail(e);
    if (o) setOtp(o);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !otp || !newPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="h-16 w-16 rounded-full bg-doju-lime-pale flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Lock className="h-8 w-8 text-doju-lime" />
                </motion.div>
              </div>

              <h1 className="text-3xl font-bold text-foreground text-center mb-3">
                Reset your password
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                Enter the code we sent to your email and pick a new password.
              </p>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg h-14 mb-4"
                  autoFocus
                />
                <Input
                  type="text"
                  placeholder="Reset code (OTP)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-lg h-14 mb-4"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-lg h-14 mb-4"
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-lg h-14 mb-6"
                />
                <Button
                  type="submit"
                  variant="doju-primary"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? "Resetting…" : "Reset password"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Remembered it?{" "}
                <Link to="/login" className="text-doju-lime hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md text-center"
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="h-20 w-20 rounded-full bg-doju-lime-pale flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-doju-lime" />
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                Password updated
              </h1>
              <p className="text-muted-foreground mb-8">
                You can now log in with your new password.
              </p>

              <Button
                variant="doju-primary"
                size="lg"
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                Back to login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ResetPassword;

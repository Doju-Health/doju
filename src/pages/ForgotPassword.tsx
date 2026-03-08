import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { ArrowLeft, ArrowRight, Mail, CheckCircle } from "lucide-react";
import { useForgotPassword } from "./Auth/api/use-forgot-password"; // adjust path if necessary

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // once the reset link has been requested we redirect immediately
  const { mutate: forgot, isPending: isSubmitting } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    forgot(
      { email },
      {
        onSuccess: () => {
          // navigate to reset page and prefill email
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
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
          {/* success is handled by redirect, so we always show form */}
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
                <Mail className="h-8 w-8 text-doju-lime" />
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold text-foreground text-center mb-3">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="What's your email address?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg h-14 mb-6"
                autoFocus
              />
              <Button
                type="submit"
                variant="doju-primary"
                size="lg"
                className="w-full"
                disabled={!email || isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send reset code"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-doju-lime hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { ArrowLeft, ArrowRight, Mail, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center">
          <button
            onClick={() => navigate("/login")}
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
                  disabled={!email}
                >
                  Send reset link
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
                Check your email
              </h1>
              <p className="text-muted-foreground mb-8">
                We've sent a password reset link to <strong>{email}</strong>.
                Click the link to create a new password.
              </p>

              <Button
                variant="doju-primary"
                size="lg"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>

              <p className="text-sm text-muted-foreground mt-6">
                Didn't receive the email?{" "}
                <button
                  className="text-doju-lime hover:underline"
                  onClick={() => setSubmitted(false)}
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ForgotPassword;

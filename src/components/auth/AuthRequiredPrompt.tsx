import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, ArrowRight, Lock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AuthRequiredPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center"
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6"
          >
            <div className="h-20 w-20 rounded-full bg-doju-lime/20 flex items-center justify-center mx-auto">
              <Lock className="h-10 w-10 text-doju-lime" />
            </div>
          </motion.div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Hey there! 👋
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Looks like you're interested in our products!
          </p>
          <p className="text-muted-foreground mb-8">
            Sign in to browse our full catalog of premium medical equipment and
            supplies. It only takes a moment.
          </p>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="doju-primary"
                size="lg"
                className="w-full gap-2 h-14 text-base"
                onClick={() => navigate("/auth")}
              >
                <ShoppingBag className="h-5 w-5" />
                Buy from Us Now!
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="doju-outline"
                size="lg"
                className="w-full gap-2 h-14 text-base"
                onClick={() => navigate("/seller-onboarding")}
              >
                <Store className="h-5 w-5" />
                Sell Through Us
              </Button>
            </motion.div>
          </div>

          {/* Already have account */}
          <p className="mt-8 text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-doju-lime font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthRequiredPrompt;

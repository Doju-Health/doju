import { Link } from "react-router-dom";
import dojuLogo from "@/assets/doju-logo.jpg";
import { useAppSelector } from "@/redux/hooks";

const Footer = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.authData.isAuthenticated,
  );

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src={dojuLogo}
                alt="Doju"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-md"
              />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Doju
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your centralized health marketplace
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/dojuhealth?igsh=MWdoZHV5Y2Rsczl4ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            
              <a
                href="https://www.tiktok.com/@doju.health.ltd?_r=1&_t=ZS-95tOI8G2OY9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                TikTok
              </a> 
              <a
                href="https://www.facebook.com/share/1CixRwtcXE/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Facebook
              </a>
          
              <a
                href="https://www.linkedin.com/company/doju-health-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">
              Contact
            </h4>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="break-all">
                <a
                  href="mailto:info@dojuhealth.com"
                  className="hover:text-foreground transition-colors"
                >
                  info@dojuhealth.com
                </a>
              </p>
              <p className="break-all">
                Partnership:{" "}
                <a
                  href="mailto:partnership@dojuhealth.com"
                  className="hover:text-foreground transition-colors"
                >
                  partnership@dojuhealth.com
                </a>
              </p>
              <p className="break-all">
                Customer Service:{" "}
                <a
                  href="mailto:support@dojuhealth.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@dojuhealth.com
                </a>
              </p>
              <p className="break-all">
                Vendor:{" "}
                <a
                  href="mailto:vendors@dojuhealth.com"
                  className="hover:text-foreground transition-colors"
                >
                  vendors@dojuhealth.com
                </a>
              </p>
              <p>+234 813 927 3018</p>
              <p>Mon–Sun, 24hours</p>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">
              Legal
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/return-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Return Policy
              </Link>
              <Link
                to="/refund-policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                to="/dispute-resolution"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dispute Resolution Policy
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">
              Company
            </h4>
            <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              {isAuthenticated && (
                <Link
                  to="/track-order"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Order
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            © 2026 Doju. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

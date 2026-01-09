import { Link } from 'react-router-dom';
import dojuLogo from '@/assets/doju-logo.jpg';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <img src={dojuLogo} alt="Doju" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-md" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Doju</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your trusted source for clinical-grade medical equipment and supplies.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">Contact</h4>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="break-all">dojuhealthltd@gmail.com</p>
              <p>+234 13 456 689</p>
              <p>Mon–Fri, 9am–6pm</p>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">Legal</h4>
            <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/return-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Return Policy
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-foreground text-sm sm:text-base">Company</h4>
            <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/track-order" className="text-muted-foreground hover:text-foreground transition-colors">
                Track Order
              </Link>
              <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link to="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                Press
              </Link>
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

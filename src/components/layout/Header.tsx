import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LogOut,
  Shield,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/redux/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchDialog from "@/components/search/SearchDialog";
import NotificationBell from "@/components/notifications/NotificationBell";
import dojuLogo from "@/assets/doju-logo.jpg";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";

const Header = () => {
  const { totalItems } = useCart();
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Products", href: "/marketplace" },
    { label: "Track Order", href: "/track-order" },
  ];

  const handleSignOut = async () => {
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={dojuLogo}
              alt="Doju"
              className="h-10 w-10 rounded-full object-cover shadow-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Button & Actions */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <Button
              variant="outline"
              className="w-64 justify-start text-muted-foreground gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              Search products...
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notification Bell - only for logged in users */}
            {userProfile && <NotificationBell />}

            {userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex gap-2"
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    {userProfile.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {userProfile.user.role === "seller" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/seller-dashboard")}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Seller Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex gap-2"
                >
                  <User className="h-4 w-4" />
                  Sign in
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-doju-lime text-xs font-bold text-doju-navy">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                    Search products...
                  </Button>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t pt-4 space-y-2">
                    {userProfile ? (
                      <>
                        {userProfile.user.role === "seller" && (
                          <Link to="/seller-dashboard">
                            <Button
                              variant="doju-outline"
                              className="w-full gap-2"
                            >
                              <Store className="h-4 w-4" />
                              Seller Dashboard
                            </Button>
                          </Link>
                        )}

                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth">
                          <Button variant="doju-outline" className="w-full">
                            Sign in
                          </Button>
                        </Link>
                        <Link to="/auth">
                          <Button variant="doju-primary" className="w-full">
                            Create account
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Header;

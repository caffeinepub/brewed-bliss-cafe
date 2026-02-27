import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Coffee, Menu, X, ShieldCheck } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { Theme } from "../App";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Book a Table", href: "#booking" },
  { label: "Loyalty", href: "#loyalty" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({
  theme,
  onToggleTheme,
  isAdmin,
  onAdminClick,
}: NavbarProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!identity;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
              <img
                src="/assets/generated/cafe-logo-transparent.dim_200x200.png"
                alt="Brewed Bliss"
                className="w-9 h-9 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-display text-xl font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
              Brewed Bliss
            </span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200"
                >
                  {link.label}
                </button>
              </li>
            ))}
            {isAdmin && (
              <li>
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="px-4 py-2 text-sm font-medium text-primary flex items-center gap-1.5 rounded-md hover:bg-primary/10 transition-all duration-200"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              </li>
            )}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="hidden sm:flex border-primary/30 text-primary hover:bg-primary/10 hover:border-primary font-medium"
              >
                <Coffee className="w-3.5 h-3.5 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="hidden sm:flex bg-primary text-primary-foreground hover:opacity-90 font-medium"
              >
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md hover:bg-muted/60 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 bg-background/95 backdrop-blur-md">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      onAdminClick();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-primary flex items-center gap-1.5 hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                </li>
              )}
              <li className="pt-2 border-t border-border/50 mt-2 px-2">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="w-full border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Coffee className="w-3.5 h-3.5 mr-1.5" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    {isLoggingIn ? "Connecting..." : "Login"}
                  </Button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

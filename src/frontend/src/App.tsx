import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection";
import BookingSection from "./components/BookingSection";
import LoyaltySection from "./components/LoyaltySection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import { useIsCallerAdmin } from "./hooks/useQueries";

export type Theme = "light" | "dark";

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brewed-bliss-theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("brewed-bliss-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  if (showAdmin && isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Toaster richColors position="top-right" />
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster richColors position="top-right" />
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={!!isAdmin}
        onAdminClick={() => setShowAdmin(true)}
      />
      <main>
        <HeroSection />
        <MenuSection />
        <BookingSection />
        <LoyaltySection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

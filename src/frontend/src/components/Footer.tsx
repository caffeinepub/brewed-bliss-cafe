import { Coffee, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
              <img
                src="/assets/generated/cafe-logo-transparent.dim_200x200.png"
                alt="Brewed Bliss"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display text-lg font-semibold text-foreground">
              Brewed Bliss
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            {["#menu", "#booking", "#loyalty", "#reviews", "#contact"].map(
              (href) => (
                <button
                  key={href}
                  type="button"
                  onClick={() =>
                    document
                      .querySelector(href)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="capitalize hover:text-foreground transition-colors"
                >
                  {href.replace("#", "")}
                </button>
              )
            )}
          </nav>

          {/* Built with love */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Coffee className="w-4 h-4 text-primary" />
            <span>© 2026. Built with</span>
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            42, Koramangala 5th Block, Bangalore – 560095 ·{" "}
            <a href="tel:+919876543210" className="hover:text-foreground transition-colors">
              +91 98765 43210
            </a>{" "}
            ·{" "}
            <a
              href="mailto:hello@brewedbliss.cafe"
              className="hover:text-foreground transition-colors"
            >
              hello@brewedbliss.cafe
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

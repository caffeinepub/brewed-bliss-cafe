import { Button } from "@/components/ui/button";
import { Clock, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-cafe.dim_1600x900.jpg"
          alt="Brewed Bliss Café interior"
          className="w-full h-full object-cover"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Hours Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in">
          <Clock className="w-4 h-4 text-cafe-amber" />
          <span>Open Daily 8AM – 10PM</span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-none mb-6 animate-fade-in-up">
          Where Every Sip
          <br />
          <em className="font-semibold italic" style={{ color: "oklch(var(--amber))" }}>
            Tells a Story
          </em>
        </h1>

        <p className="text-lg sm:text-xl text-white/75 font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animate-stagger-2">
          Premium café experience in the heart of the city. Hand-crafted drinks,
          artisanal food, and moments you'll remember.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-stagger-3">
          <Button
            size="lg"
            onClick={() => scrollTo("menu")}
            className="w-full sm:w-auto min-w-[160px] text-base font-medium px-8 py-6 bg-cafe-amber text-cafe-espresso hover:opacity-90 shadow-amber-glow transition-all duration-300 hover:scale-105"
          >
            Explore Menu
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("booking")}
            className="w-full sm:w-auto min-w-[160px] text-base font-medium px-8 py-6 border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-all duration-300"
          >
            Book a Table
          </Button>
        </div>

        {/* Scroll cue */}
        <div className="mt-20 flex justify-center animate-bounce opacity-60">
          <button
            type="button"
            onClick={() => scrollTo("menu")}
            aria-label="Scroll to menu"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

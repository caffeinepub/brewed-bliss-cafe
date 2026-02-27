import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";

const HOURS = [
  { day: "Monday – Friday", time: "8:00 AM – 10:00 PM" },
  { day: "Saturday – Sunday", time: "7:00 AM – 11:00 PM" },
  { day: "Public Holidays", time: "9:00 AM – 9:00 PM" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Find Us
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground mb-4">
            Come{" "}
            <span className="font-semibold italic text-primary">Visit</span> Us
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            We're nestled in the heart of Koramangala. Walk in, stay a while.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {/* Address */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">
                    Address
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    42, Koramangala 5th Block
                    <br />
                    Bangalore – 560095
                    <br />
                    Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">
                    Phone / WhatsApp
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-primary hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:hello@brewedbliss.cafe"
                    className="text-sm text-primary hover:underline"
                  >
                    hello@brewedbliss.cafe
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground mb-3">
                    Operating Hours
                  </p>
                  <ul className="space-y-2">
                    {HOURS.map((h) => (
                      <li
                        key={h.day}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 text-sm"
                      >
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className="font-medium text-foreground">
                          {h.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 px-2">
              <p className="text-xs text-muted-foreground">Follow us:</p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="lg:col-span-3">
            <div className="w-full h-96 lg:h-full min-h-[400px] rounded-2xl border border-border bg-muted/40 overflow-hidden relative flex items-center justify-center">
              {/* Stylized map placeholder */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, oklch(var(--border)) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, oklch(var(--border)) 0px, transparent 1px, transparent 40px)",
                  }}
                />
              </div>
              {/* Roads */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-1/2 left-0 right-0 h-8 -translate-y-1/2"
                  style={{ background: "oklch(var(--muted))" }}
                />
                <div
                  className="absolute left-1/3 top-0 bottom-0 w-6"
                  style={{ background: "oklch(var(--muted))" }}
                />
              </div>

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-amber-glow mx-auto mb-4 animate-pulse-soft">
                  <MapPin className="w-7 h-7 text-primary-foreground" fill="currentColor" />
                </div>
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-5 py-3 shadow-xs">
                  <p className="font-display text-lg font-semibold text-foreground">
                    Brewed Bliss Café
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    42, Koramangala 5th Block, Bangalore
                  </p>
                  <a
                    href="https://maps.google.com/?q=Koramangala+5th+Block+Bangalore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-primary hover:underline font-medium"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Gift, Star, Trophy, Crown, Copy } from "lucide-react";
import { useRegisterMember, useGetMemberByPhone } from "../hooks/useQueries";
import type { Member } from "../backend.d";
import { toast } from "sonner";

// Tier configuration
const TIERS = [
  {
    key: "Bronze",
    label: "Bronze",
    icon: Gift,
    min: 0,
    max: 499,
    color: "text-amber-700 dark:text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    benefits: ["5% discount on all orders", "Early access to seasonal menus", "Birthday bonus: 50 points"],
  },
  {
    key: "Silver",
    label: "Silver",
    icon: Star,
    min: 500,
    max: 1999,
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-300 dark:border-slate-600",
    benefits: ["10% discount on all orders", "Free birthday dessert", "Priority table reservations", "Monthly exclusive offers"],
  },
  {
    key: "Gold",
    label: "Gold",
    icon: Crown,
    min: 2000,
    max: Infinity,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-300 dark:border-yellow-600",
    benefits: ["15% discount on all orders", "Complimentary welcome drink", "Dedicated loyalty manager", "Exclusive Gold-member events", "Free delivery on orders"],
  },
];

function generateReferralCode() {
  return "BB" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

export default function LoyaltySection() {
  const [tab, setTab] = useState<"signup" | "lookup">("signup");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [lookupPhone, setLookupPhone] = useState("");
  const [foundMember, setFoundMember] = useState<Member | null>(null);

  const registerMember = useRegisterMember();
  const getMember = useGetMemberByPhone();

  const setField = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please enter your name and phone.");
      return;
    }

    const referral = generateReferralCode();
    const member: Member = {
      id: 0n,
      name: form.name,
      phone: form.phone,
      email: form.email,
      totalPoints: 0n,
      tier: "Bronze",
      referralCode: referral,
      joinedAt: BigInt(Date.now()),
      totalVisits: 0n,
    };

    try {
      await registerMember.mutateAsync(member);
      toast.success("Welcome to Brewed Bliss Loyalty!", {
        description: `Your referral code: ${referral}`,
        duration: 8000,
      });
      setForm({ name: "", phone: "", email: "" });
    } catch {
      toast.error("Registration failed. You may already be a member.");
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone) {
      toast.error("Enter your phone number.");
      return;
    }
    try {
      const member = await getMember.mutateAsync(lookupPhone);
      if (member) {
        setFoundMember(member);
      } else {
        toast.error("No member found with this phone number.");
        setFoundMember(null);
      }
    } catch {
      toast.error("Lookup failed. Please try again.");
    }
  };

  const getTierInfo = (tier: string) =>
    TIERS.find((t) => t.key === tier) || TIERS[0];

  return (
    <section
      id="loyalty"
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, oklch(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, oklch(var(--amber)) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Rewards Program
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground mb-4">
            The{" "}
            <span className="font-semibold italic text-primary">Bliss</span>{" "}
            Club
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Every visit earns you points. Collect them, climb the tiers, and
            unlock exclusive rewards crafted for our most loyal guests.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.key}
                className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 card-lift shadow-xs`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${tier.bg} border ${tier.border}`}
                  >
                    <Icon className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-display text-xl font-bold ${tier.color}`}>
                      {tier.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {tier.max === Infinity
                        ? `${tier.min}+ pts`
                        : `${tier.min}–${tier.max} pts`}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tier.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <Trophy
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tier.color}`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Sign-up / Lookup Panel */}
        <div className="max-w-xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-muted/60 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setFoundMember(null);
              }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === "signup"
                  ? "bg-card shadow-xs text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Join the Club
            </button>
            <button
              type="button"
              onClick={() => setTab("lookup")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                tab === "lookup"
                  ? "bg-card shadow-xs text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Check Points
            </button>
          </div>

          {tab === "signup" ? (
            <form
              onSubmit={handleSignup}
              className="bg-card rounded-2xl border border-border p-6 shadow-card-lift space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="loyalty-name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="loyalty-name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loyalty-phone" className="text-sm font-medium">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="loyalty-phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loyalty-email" className="text-sm font-medium">
                  Email (optional)
                </Label>
                <Input
                  id="loyalty-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-5"
                disabled={registerMember.isPending}
              >
                {registerMember.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining…
                  </>
                ) : (
                  "Join Bliss Club — It's Free!"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You earn 10 points for every ₹100 spent.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <form
                onSubmit={handleLookup}
                className="bg-card rounded-2xl border border-border p-6 shadow-card-lift space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="lookup-phone"
                    className="text-sm font-medium"
                  >
                    Enter your phone number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="lookup-phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={getMember.isPending}
                      className="bg-primary text-primary-foreground hover:opacity-90"
                    >
                      {getMember.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Member Card */}
              {foundMember && (
                <MemberCard member={foundMember} getTierInfo={getTierInfo} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface MemberCardProps {
  member: Member;
  getTierInfo: (tier: string) => (typeof TIERS)[number];
}

function MemberCard({ member, getTierInfo }: MemberCardProps) {
  const tier = getTierInfo(member.tier);
  const pts = Number(member.totalPoints);
  const TierIcon = tier.icon;

  // Calculate progress to next tier
  const nextTier = TIERS.find((t) => t.min > tier.min);
  const progress = nextTier
    ? Math.min(100, ((pts - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;
  const ptsToNext = nextTier ? nextTier.min - pts : 0;

  return (
    <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 shadow-card-lift`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            {member.name}
          </h3>
          <p className="text-sm text-muted-foreground">{member.phone}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${tier.border} ${tier.bg}`}>
          <TierIcon className={`w-4 h-4 ${tier.color}`} />
          <span className={`text-sm font-semibold ${tier.color}`}>
            {tier.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 bg-background/60 rounded-xl">
          <p className="font-display text-2xl font-bold text-primary">{pts}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Points</p>
        </div>
        <div className="text-center p-3 bg-background/60 rounded-xl">
          <p className="font-display text-2xl font-bold text-foreground">
            {String(member.totalVisits)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Visits</p>
        </div>
        <div className="text-center p-3 bg-background/60 rounded-xl">
          <p className="font-display text-2xl font-bold text-foreground">
            {nextTier ? ptsToNext : "∞"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">To next</p>
        </div>
      </div>

      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{tier.label}</span>
            <span>{nextTier.label}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Referral Code</p>
          <p className="font-mono font-semibold text-primary text-sm">
            {member.referralCode}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(member.referralCode);
            toast.success("Referral code copied!");
          }}
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy
        </Button>
      </div>
    </div>
  );
}

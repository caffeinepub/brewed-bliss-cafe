import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  PartyPopper,
  Briefcase,
} from "lucide-react";
import { useIsSlotAvailable, useCreateBooking } from "../hooks/useQueries";
import type { Booking } from "../backend.d";
import { toast } from "sonner";

// Generate 15-min interval time slots from 8:00 AM to 9:45 PM
function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = 8; h <= 21; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 21 && m > 45) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h < 12 ? "AM" : "PM";
      const minStr = m === 0 ? "00" : String(m);
      slots.push(`${hour12}:${minStr} ${ampm}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const EVENT_TYPES = [
  { value: "Regular", label: "Regular Visit" },
  { value: "Birthday", label: "Birthday Celebration 🎂" },
  { value: "Corporate", label: "Corporate Meeting 💼" },
  { value: "Private Party", label: "Private Party 🎉" },
];

const SPECIAL_EVENTS = new Set(["Birthday", "Corporate", "Private Party"]);

interface FormState {
  name: string;
  phone: string;
  email: string;
  partySize: string;
  date: string;
  timeSlot: string;
  eventType: string;
  specialRequests: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  partySize: "2",
  date: "",
  timeSlot: "",
  eventType: "Regular",
  specialRequests: "",
};

function SlotAvailabilityIndicator({
  date,
  timeSlot,
}: {
  date: string;
  timeSlot: string;
}) {
  const { data: available, isLoading } = useIsSlotAvailable(date, timeSlot);

  if (!date || !timeSlot) return null;
  if (isLoading)
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…
      </span>
    );

  return available ? (
    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
      <CheckCircle2 className="w-4 h-4" /> Slot available
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs font-medium text-destructive">
      <XCircle className="w-4 h-4" /> Slot full — try another time
    </span>
  );
}

export default function BookingSection() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const createBooking = useCreateBooking();

  const setField = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isSpecialEvent = SPECIAL_EVENTS.has(form.eventType);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.timeSlot) {
      toast.error("Please fill all required fields.");
      return;
    }

    const booking: Booking = {
      id: 0n,
      customerName: form.name,
      customerPhone: form.phone,
      date: form.date,
      timeSlot: form.timeSlot,
      partySize: BigInt(form.partySize),
      eventType: form.eventType,
      specialRequests: form.specialRequests,
      status: "Pending",
      createdAt: BigInt(Date.now()),
    };

    try {
      const id = await createBooking.mutateAsync(booking);
      toast.success("Table booked successfully!", {
        description: `Booking ID: #${id}. We'll confirm via SMS shortly.`,
        duration: 6000,
      });
      setForm(DEFAULT_FORM);
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <section
      id="booking"
      className="section-padding"
      style={{ background: "oklch(var(--muted) / 0.4)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Reserve Your Spot
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground mb-4">
            Book a{" "}
            <span className="font-semibold italic text-primary">Table</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Reserve your perfect moment at Brewed Bliss. We'll craft an
            unforgettable experience just for you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border shadow-card-lift p-6 sm:p-8 space-y-6"
        >
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="booking-name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-phone" className="text-sm font-medium">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="booking-phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email + Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-email" className="text-sm font-medium">
                Email (optional)
              </Label>
              <Input
                id="booking-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-party" className="text-sm font-medium">
                <Users className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Party Size <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.partySize}
                onValueChange={(v) => setField("partySize", v)}
              >
                <SelectTrigger id="booking-party">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(
                    (n) => (
                      <SelectItem key={n} value={n}>
                        {n} {Number(n) === 1 ? "person" : "people"}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date" className="text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="booking-date"
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-time" className="text-sm font-medium">
                <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Time Slot <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.timeSlot}
                onValueChange={(v) => setField("timeSlot", v)}
              >
                <SelectTrigger id="booking-time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.date && form.timeSlot && (
                <div className="mt-1.5">
                  <SlotAvailabilityIndicator
                    date={form.date}
                    timeSlot={form.timeSlot}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="booking-event" className="text-sm font-medium">
              Event Type
            </Label>
            <Select
              value={form.eventType}
              onValueChange={(v) => setField("eventType", v)}
            >
              <SelectTrigger id="booking-event">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special Event Info Box */}
          {isSpecialEvent && (
            <div className="rounded-xl p-4 bg-primary/10 border border-primary/20 flex items-start gap-3">
              {form.eventType === "Birthday" && (
                <PartyPopper className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              )}
              {form.eventType === "Corporate" && (
                <Briefcase className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              )}
              {form.eventType === "Private Party" && (
                <PartyPopper className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-primary mb-1">
                  {form.eventType === "Birthday"
                    ? "Birthday Celebration Package"
                    : form.eventType === "Corporate"
                      ? "Corporate Meeting Setup"
                      : "Private Party Booking"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {form.eventType === "Birthday"
                    ? "We'll arrange a special birthday setup with complimentary cake and décor. Please mention the guest of honour's name in special requests."
                    : form.eventType === "Corporate"
                      ? "We offer dedicated quiet seating, projector on request, and premium beverage packages for corporate gatherings."
                      : "Our team will help you plan a memorable private event. Please share more details in special requests."}
                </p>
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="booking-requests" className="text-sm font-medium">
              Special Requests
            </Label>
            <Textarea
              id="booking-requests"
              placeholder="Any dietary requirements, accessibility needs, or other requests…"
              rows={3}
              value={form.specialRequests}
              onChange={(e) => setField("specialRequests", e.target.value)}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-6 text-base"
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming Reservation…
              </>
            ) : (
              "Confirm Reservation"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We'll send a confirmation via SMS. For queries call{" "}
            <span className="text-foreground font-medium">+91 98765 43210</span>
          </p>
        </form>
      </div>
    </section>
  );
}

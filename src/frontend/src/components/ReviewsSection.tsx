import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Loader2, Quote } from "lucide-react";
import { useGetAllReviews, useSubmitReview } from "../hooks/useQueries";
import type { Review } from "../backend.d";
import { toast } from "sonner";

const STATIC_REVIEWS: Review[] = [
  {
    id: 1n,
    customerName: "Priya Sharma",
    rating: 5n,
    comment: "Absolutely love this café! The Signature Latte is the best I've had in Bangalore. The atmosphere is so cozy and the staff are incredibly warm.",
    createdAt: BigInt(Date.now() - 86400000 * 3),
  },
  {
    id: 2n,
    customerName: "Rahul Mehta",
    rating: 5n,
    comment: "The Chocolate Lava Cake is sinfully good. Brewed Bliss has become my weekend ritual — great food, great ambiance, great service.",
    createdAt: BigInt(Date.now() - 86400000 * 7),
  },
  {
    id: 3n,
    customerName: "Ananya Reddy",
    rating: 4n,
    comment: "Lovely place to work or catch up with friends. The Avocado Toast was fresh and beautifully presented. Only wish they had more parking!",
    createdAt: BigInt(Date.now() - 86400000 * 14),
  },
];

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform duration-150 hover:scale-125"
          aria-label={`Rate ${n} stars`}
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              n <= (hover || value)
                ? "text-cafe-amber fill-cafe-amber"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const stars = Number(review.rating);
  const date = new Date(Number(review.createdAt)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs card-lift">
      <Quote className="w-8 h-8 text-primary/20 mb-3" />
      <p className="text-sm text-foreground/85 leading-relaxed mb-4">
        {review.comment}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm text-foreground">
            {review.customerName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`w-4 h-4 ${n <= stars ? "text-cafe-amber fill-cafe-amber" : "text-muted-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
      <Skeleton className="h-6 w-8" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { data: backendReviews, isLoading } = useGetAllReviews();
  const submitReview = useSubmitReview();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviews =
    backendReviews && backendReviews.length > 0
      ? backendReviews
      : STATIC_REVIEWS;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((a, r) => a + Number(r.rating), 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || rating === 0 || !comment) {
      toast.error("Please fill all fields and select a rating.");
      return;
    }

    const review: Review = {
      id: 0n,
      customerName: name,
      rating: BigInt(rating),
      comment,
      createdAt: BigInt(Date.now()),
    };

    try {
      await submitReview.mutateAsync(review);
      toast.success("Thank you for your review!", {
        description: "Your feedback helps us improve.",
      });
      setName("");
      setRating(0);
      setComment("");
    } catch {
      toast.error("Could not submit review. Please try again.");
    }
  };

  return (
    <section
      id="reviews"
      className="section-padding"
      style={{ background: "oklch(var(--muted) / 0.3)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Guest Voices
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground mb-4">
            What Our{" "}
            <span className="font-semibold italic text-primary">Guests</span>{" "}
            Say
          </h2>

          {/* Overall rating */}
          <div className="inline-flex items-center gap-3 mt-2 px-6 py-3 rounded-full bg-card border border-border shadow-xs">
            <span className="font-display text-3xl font-bold text-primary">
              {avgRating.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${n <= Math.round(avgRating) ? "text-cafe-amber fill-cafe-amber" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => `rv-sk-${i}`).map((k) => (
                  <ReviewSkeleton key={k} />
                ))
              : reviews.map((r) => (
                  <ReviewCard key={String(r.id)} review={r} />
                ))}
          </div>

          {/* Submit form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl border border-border p-6 shadow-card-lift space-y-4 lg:sticky lg:top-24"
            >
              <h3 className="font-display text-xl font-semibold text-foreground">
                Leave a Review
              </h3>
              <p className="text-xs text-muted-foreground">
                Share your Brewed Bliss experience with other guests.
              </p>

              <div className="space-y-2">
                <Label htmlFor="review-name" className="text-sm font-medium">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="review-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Rating <span className="text-destructive">*</span>
                </Label>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {
                      ["", "Poor", "Fair", "Good", "Great", "Excellent!"][
                        rating
                      ]
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment" className="text-sm font-medium">
                  Your Review <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review-comment"
                  placeholder="Tell us about your experience…"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold"
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

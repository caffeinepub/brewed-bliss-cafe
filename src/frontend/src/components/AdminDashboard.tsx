import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  UtensilsCrossed,
  CalendarDays,
  Users,
  Star,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";
import {
  useGetAllMenuItems,
  useGetAllBookings,
  useGetAllMembers,
  useGetAllReviews,
  useAddMenuItem,
  useToggleMenuItemAvailability,
  useDeleteMenuItem,
  useUpdateBookingStatus,
  useDeleteReview,
  useAddMemberPoints,
} from "../hooks/useQueries";
import type { MenuItem } from "../backend.d";
import { toast } from "sonner";

type AdminTab = "menu" | "bookings" | "members" | "reviews";

const TABS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "members", label: "Members", icon: Users },
  { key: "reviews", label: "Reviews", icon: Star },
];

function formatPrice(paise: bigint) {
  return `₹${(Number(paise) / 100).toFixed(0)}`;
}

// ── Menu Management ────────────────────────────────────────────────────────────

function AddMenuItemForm({ onClose }: { onClose: () => void }) {
  const addItem = useAddMenuItem();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Beverages",
    price: "",
    imageUrl: "",
    dietaryTags: "",
    spiceLevel: "0",
    isChefRecommended: false,
  });

  const setField = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Name and price are required.");
      return;
    }
    const tags = form.dietaryTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const item: MenuItem = {
      id: 0n,
      name: form.name,
      description: form.description,
      category: form.category,
      price: BigInt(Math.round(parseFloat(form.price) * 100)),
      imageUrl: form.imageUrl,
      dietaryTags: tags,
      spiceLevel: BigInt(form.spiceLevel),
      isAvailable: true,
      isChefRecommended: form.isChefRecommended,
      rating: 40n,
    };
    try {
      await addItem.mutateAsync(item);
      toast.success("Menu item added!");
      onClose();
    } catch {
      toast.error("Failed to add menu item.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-xl border border-border p-5 space-y-4 mt-4"
    >
      <h3 className="font-display text-lg font-semibold">Add New Item</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Name *</Label>
          <Input
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Price (₹) *</Label>
          <Input
            type="number"
            placeholder="280"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setField("category", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Beverages", "Breakfast", "Mains", "Desserts", "Combos"].map(
                (c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Spice Level</Label>
          <Select
            value={form.spiceLevel}
            onValueChange={(v) => setField("spiceLevel", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="1">Mild</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">Hot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea
            placeholder="Brief description…"
            rows={2}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <Input
            placeholder="/assets/generated/…"
            value={form.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Dietary Tags (comma-separated)</Label>
          <Input
            placeholder="Vegan, Gluten-Free"
            value={form.dietaryTags}
            onChange={(e) => setField("dietaryTags", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="chef-pick"
          checked={form.isChefRecommended}
          onChange={(e) => setField("isChefRecommended", e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="chef-pick" className="text-xs cursor-pointer">
          Chef's Recommendation
        </Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          className="bg-primary text-primary-foreground hover:opacity-90"
          disabled={addItem.isPending}
        >
          {addItem.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Item
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function MenuTab() {
  const { data: items, isLoading } = useGetAllMenuItems();
  const toggleAvail = useToggleMenuItemAvailability();
  const deleteItem = useDeleteMenuItem();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: bigint, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success(`"${name}" deleted.`);
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleToggle = async (id: bigint) => {
    try {
      await toggleAvail.mutateAsync(id);
    } catch {
      toast.error("Toggle failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">Menu Management</h2>
        <Button
          size="sm"
          onClick={() => setShowForm((v) => !v)}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Item
        </Button>
      </div>

      {showForm && <AddMenuItemForm onClose={() => setShowForm(false)} />}

      <div className="rounded-xl border border-border overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => `m-sk-${i}`).map((k) => (
                  <TableRow key={k}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-7 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : (items ?? []).map((item) => (
                  <TableRow key={String(item.id)}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={item.isAvailable ? "default" : "secondary"}
                        className={
                          item.isAvailable
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {item.isAvailable ? "Available" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggle(item.id)}
                          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title={
                            item.isAvailable
                              ? "Hide from menu"
                              : "Show on menu"
                          }
                        >
                          {item.isAvailable ? (
                            <ToggleRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Bookings ──────────────────────────────────────────────────────────────────

function BookingsTab() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [dateFilter, setDateFilter] = useState("");

  const filtered = dateFilter
    ? (bookings ?? []).filter((b) => b.date === dateFilter)
    : (bookings ?? []);

  const getStatusColor = (status: string) => {
    if (status === "Confirmed")
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    if (status === "Cancelled")
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
  };

  const handleStatus = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Booking status updated to ${status}.`);
    } catch {
      toast.error("Update failed.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl font-semibold">Bookings</h2>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground shrink-0">
            Filter by date:
          </Label>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className="text-xs text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Time</TableHead>
              <TableHead className="hidden lg:table-cell">Party</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => `b-sk-${i}`).map((k) => (
                  <TableRow key={k}>
                    {Array.from({ length: 5 }, (_, j) => `b-td-${j}`).map(
                      (tk) => (
                        <TableCell key={tk}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              : filtered.map((b) => (
                  <TableRow key={String(b.id)}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{b.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.customerPhone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {b.date}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {b.timeSlot}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {String(b.partySize)} pax · {b.eventType}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(b.status)}`}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleStatus(b.id, "Confirmed")
                          }
                          title="Confirm"
                          className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatus(b.id, "Cancelled")
                          }
                          title="Cancel"
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Members ────────────────────────────────────────────────────────────────────

function MembersTab() {
  const { data: members, isLoading } = useGetAllMembers();
  const addPoints = useAddMemberPoints();
  const [pointsForm, setPointsForm] = useState<{
    id: bigint;
    name: string;
    pts: string;
  } | null>(null);

  const handleAddPoints = async () => {
    if (!pointsForm || !pointsForm.pts) return;
    try {
      await addPoints.mutateAsync({
        memberId: pointsForm.id,
        points: BigInt(pointsForm.pts),
      });
      toast.success(
        `${pointsForm.pts} points added to ${pointsForm.name}.`
      );
      setPointsForm(null);
    } catch {
      toast.error("Failed to add points.");
    }
  };

  const getTierColor = (tier: string) => {
    if (tier === "Gold")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    if (tier === "Silver")
      return "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300";
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400";
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">
        Loyalty Members
      </h2>

      <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Points</TableHead>
              <TableHead className="hidden md:table-cell">Tier</TableHead>
              <TableHead className="hidden lg:table-cell">Visits</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => `mem-sk-${i}`).map(
                  (k) => (
                    <TableRow key={k}>
                      {Array.from({ length: 5 }, (_, j) => `m-td-${j}`).map(
                        (tk) => (
                          <TableCell key={tk}>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )
              : (members ?? []).map((m) => (
                  <TableRow key={String(m.id)}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {m.phone}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {String(m.totalPoints)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={`text-xs ${getTierColor(m.tier)}`}>
                        {m.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {String(m.totalVisits)}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() =>
                          setPointsForm({
                            id: m.id,
                            name: m.name,
                            pts: "",
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Points
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && (members ?? []).length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  No members yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Points Modal */}
      {pointsForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-card-hover">
            <h3 className="font-display text-lg font-semibold mb-1">
              Add Points
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              For <span className="text-foreground font-medium">{pointsForm.name}</span>
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Points to add"
                value={pointsForm.pts}
                onChange={(e) =>
                  setPointsForm((p) => p && { ...p, pts: e.target.value })
                }
                className="flex-1"
                autoFocus
              />
              <Button
                onClick={handleAddPoints}
                className="bg-primary text-primary-foreground hover:opacity-90"
                disabled={addPoints.isPending}
              >
                {addPoints.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setPointsForm(null)}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reviews ────────────────────────────────────────────────────────────────────

function ReviewsAdminTab() {
  const { data: reviews, isLoading } = useGetAllReviews();
  const deleteReview = useDeleteReview();

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview.mutateAsync(id);
      toast.success("Review deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }, (_, i) => `rv-admin-sk-${i}`).map(
              (k) => (
                <div
                  key={k}
                  className="rounded-xl border border-border p-4 space-y-2"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              )
            )
          : (reviews ?? []).map((r) => (
              <div
                key={String(r.id)}
                className="bg-card rounded-xl border border-border p-4 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{r.customerName}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${n <= Number(r.rating) ? "text-cafe-amber fill-cafe-amber" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {r.comment}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        {!isLoading && (reviews ?? []).length === 0 && (
          <p className="text-center py-10 text-muted-foreground text-sm">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("menu");

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Site
          </button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <img
                src="/assets/generated/cafe-logo-transparent.dim_200x200.png"
                alt="Brewed Bliss"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-display font-semibold text-foreground">
              Admin Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats summary */}
        <StatsRow />

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <nav className="md:w-48 shrink-0">
            <ul className="flex md:flex-col gap-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.key} className="flex-1 md:flex-none">
                    <button
                      type="button"
                      onClick={() => setActiveTab(t.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === t.key
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline">{t.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "menu" && <MenuTab />}
            {activeTab === "bookings" && <BookingsTab />}
            {activeTab === "members" && <MembersTab />}
            {activeTab === "reviews" && <ReviewsAdminTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsRow() {
  const { data: bookings } = useGetAllBookings();
  const { data: members } = useGetAllMembers();
  const { data: reviews } = useGetAllReviews();
  const { data: menuItems } = useGetAllMenuItems();

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = (bookings ?? []).filter((b) => b.date === today).length;
  const avgRating =
    (reviews ?? []).length > 0
      ? (reviews ?? []).reduce((a, r) => a + Number(r.rating), 0) /
        (reviews ?? []).length
      : 0;

  const stats = [
    {
      label: "Today's Bookings",
      value: todayBookings,
      sub: `${(bookings ?? []).length} total`,
    },
    {
      label: "Menu Items",
      value: (menuItems ?? []).length,
      sub: `${(menuItems ?? []).filter((i) => i.isAvailable).length} available`,
    },
    { label: "Loyalty Members", value: (members ?? []).length, sub: "registered" },
    {
      label: "Avg. Rating",
      value: avgRating.toFixed(1),
      sub: `${(reviews ?? []).length} reviews`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card rounded-xl border border-border p-5 shadow-xs"
        >
          <p className="text-xs text-muted-foreground mb-1.5">{s.label}</p>
          <p className="font-display text-3xl font-bold text-primary">
            {s.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}



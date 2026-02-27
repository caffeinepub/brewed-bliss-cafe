import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Flame, ChefHat, Plus } from "lucide-react";
import { useGetAllMenuItems } from "../hooks/useQueries";
import type { MenuItem } from "../backend.d";
import { toast } from "sonner";

// Static placeholder items shown while loading or as fallback
const PLACEHOLDER_ITEMS: MenuItem[] = [
  {
    id: 1n,
    name: "Signature Latte",
    description: "Our house-crafted latte with single-origin Ethiopian beans, velvety microfoam, and a whisper of cinnamon.",
    category: "Beverages",
    price: 28000n,
    imageUrl: "/assets/generated/menu-coffee.dim_600x600.jpg",
    dietaryTags: ["Vegetarian"],
    spiceLevel: 0n,
    isAvailable: true,
    isChefRecommended: true,
    rating: 48n,
  },
  {
    id: 2n,
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough with poached eggs, microgreens, and a squeeze of lemon.",
    category: "Breakfast",
    price: 32000n,
    imageUrl: "/assets/generated/menu-breakfast.dim_600x600.jpg",
    dietaryTags: ["Vegan", "Gluten-Free"],
    spiceLevel: 1n,
    isAvailable: true,
    isChefRecommended: false,
    rating: 45n,
  },
  {
    id: 3n,
    name: "Pasta Bowl",
    description: "Creamy fettuccine with fresh basil, cherry tomatoes, and aged parmesan.",
    category: "Mains",
    price: 38000n,
    imageUrl: "/assets/generated/menu-mains.dim_600x600.jpg",
    dietaryTags: ["Vegetarian"],
    spiceLevel: 1n,
    isAvailable: true,
    isChefRecommended: true,
    rating: 47n,
  },
  {
    id: 4n,
    name: "Chocolate Lava Cake",
    description: "Warm dark chocolate cake with a molten center, served with vanilla bean ice cream.",
    category: "Desserts",
    price: 22000n,
    imageUrl: "/assets/generated/menu-dessert.dim_600x600.jpg",
    dietaryTags: ["Vegetarian"],
    spiceLevel: 0n,
    isAvailable: true,
    isChefRecommended: true,
    rating: 49n,
  },
];

const CATEGORIES = ["All", "Beverages", "Breakfast", "Mains", "Desserts", "Combos"];
const DIETARY_FILTERS = ["Vegan", "Gluten-Free", "Jain"];
const SPICE_LABELS: Record<number, string> = { 0: "All", 1: "Mild", 2: "Medium", 3: "Hot" };

function formatPrice(paise: bigint) {
  return `₹${(Number(paise) / 100).toFixed(0)}`;
}

function formatRating(r: bigint) {
  return (Number(r) / 10).toFixed(1);
}

const DIETARY_COLORS: Record<string, string> = {
  Vegan: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Gluten-Free": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Jain: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  Vegetarian: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const SPICE_KEYS = ["s1", "s2", "s3"] as const;
function SpiceIndicator({ level }: { level: bigint }) {
  const n = Number(level);
  if (n === 0) return null;
  return (
    <div className="flex items-center gap-0.5">
      {SPICE_KEYS.slice(0, n).map((k) => (
        <Flame key={k} className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />
      ))}
    </div>
  );
}

const STAR_KEYS = ["r1", "r2", "r3", "r4", "r5"] as const;
function StarRating({ rating }: { rating: bigint }) {
  const val = Number(rating) / 10;
  const full = Math.floor(val);
  return (
    <div className="flex items-center gap-1">
      {STAR_KEYS.map((k, i) => (
        <Star
          key={k}
          className={`w-3.5 h-3.5 ${i < full ? "text-cafe-amber fill-cafe-amber" : "text-muted-foreground/30"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-0.5">{val.toFixed(1)}</span>
    </div>
  );
}

function MenuCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  return (
    <button
      type="button"
      className="group rounded-xl overflow-hidden bg-card border border-border card-lift shadow-xs hover:shadow-card-hover text-left w-full transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => onSelect(item)}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={item.imageUrl || "/assets/generated/menu-coffee.dim_600x600.jpg"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.isChefRecommended && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cafe-amber/90 text-cafe-espresso text-xs font-semibold backdrop-blur-sm">
            <ChefHat className="w-3 h-3" />
            Chef's Pick
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-card-foreground leading-tight">
            {item.name}
          </h3>
          <span className="font-semibold text-primary text-sm shrink-0 mt-0.5">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.dietaryTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIETARY_COLORS[tag] || "bg-muted text-muted-foreground"}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <SpiceIndicator level={item.spiceLevel} />
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <StarRating rating={item.rating} />
          <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
            <Plus className="w-3.5 h-3.5" />
            Customize
          </span>
        </div>
      </div>
    </button>
  );
}

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

function ItemModal({ item, onClose }: ItemModalProps) {
  const [spice, setSpice] = useState(item ? Number(item.spiceLevel) : 0);
  const [addOns, setAddOns] = useState<string[]>([]);

  const ADD_ONS = [
    { label: "Extra Cheese", price: 5000n },
    { label: "Avocado", price: 8000n },
    { label: "Extra Shot", price: 6000n },
    { label: "Oat Milk", price: 4000n },
  ];

  if (!item) return null;

  const basePrice = Number(item.price);
  const addOnCost = addOns.reduce((acc, ao) => {
    const found = ADD_ONS.find((a) => a.label === ao);
    return acc + (found ? Number(found.price) : 0);
  }, 0);
  const total = basePrice + addOnCost;

  const handleAddToOrder = () => {
    toast.success(`${item.name} added to your order!`, {
      description: `₹${(total / 100).toFixed(0)} • ${addOns.length > 0 ? addOns.join(", ") : "No add-ons"}`,
    });
    onClose();
  };

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="relative rounded-xl overflow-hidden h-56 mb-0 -mx-6 -mt-6">
          <img
            src={item.imageUrl || "/assets/generated/menu-coffee.dim_600x600.jpg"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {item.isChefRecommended && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cafe-amber text-cafe-espresso text-xs font-semibold">
              <ChefHat className="w-3.5 h-3.5" />
              Chef's Pick
            </div>
          )}
        </div>

        <DialogHeader className="pt-2">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="font-display text-2xl font-semibold">
              {item.name}
            </DialogTitle>
            <span className="font-display text-xl font-semibold text-primary mt-0.5">
              {formatPrice(item.price)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Dietary Tags */}
          <div>
            <div className="flex flex-wrap gap-2">
              {item.dietaryTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`text-xs ${DIETARY_COLORS[tag] || ""}`}
                >
                  {tag}
                </Badge>
              ))}
              <div className="flex items-center gap-1 ml-1">
                <StarRating rating={item.rating} />
              </div>
            </div>
          </div>

          {/* Spice Level */}
          {Number(item.spiceLevel) > 0 && (
            <div>
              <p className="text-sm font-medium mb-2.5">Spice Level</p>
              <div className="flex gap-2">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpice(lvl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      spice === lvl
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${spice >= lvl ? "text-orange-500" : ""}`} fill={spice >= lvl ? "currentColor" : "none"} />
                    {SPICE_LABELS[lvl]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          <div>
            <p className="text-sm font-medium mb-2.5">Add-ons</p>
            <div className="grid grid-cols-2 gap-2">
              {ADD_ONS.map((ao) => {
                const selected = addOns.includes(ao.label);
                return (
                  <button
                    key={ao.label}
                    type="button"
                    onClick={() =>
                      setAddOns((prev) =>
                        selected
                          ? prev.filter((a) => a !== ao.label)
                          : [...prev, ao.label]
                      )
                    }
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <span>{ao.label}</span>
                    <span className="font-semibold">+{formatPrice(ao.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total + Add to Order */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-xl font-semibold text-foreground">
                ₹{(total / 100).toFixed(0)}
              </span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-5 text-base"
              onClick={handleAddToOrder}
              disabled={!item.isAvailable}
            >
              {item.isAvailable ? "Add to Order" : "Currently Unavailable"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MenuSection() {
  const { data: backendItems, isLoading } = useGetAllMenuItems();
  const [activeCategory, setActiveCategory] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);
  const [spiceFilter, setSpiceFilter] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const items = backendItems && backendItems.length > 0 ? backendItems : PLACEHOLDER_ITEMS;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (dietaryFilter.length > 0) {
        if (!dietaryFilter.every((f) => item.dietaryTags.includes(f))) return false;
      }
      if (spiceFilter > 0 && Number(item.spiceLevel) !== spiceFilter) return false;
      return true;
    });
  }, [items, activeCategory, dietaryFilter, spiceFilter]);

  const toggleDietary = (tag: string) => {
    setDietaryFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section id="menu" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Our Offerings
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-foreground mb-4">
            Crafted with{" "}
            <span className="font-semibold italic text-primary">Passion</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Each item on our menu is thoughtfully created using locally sourced
            ingredients and time-honoured techniques.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <span className="text-xs text-muted-foreground font-medium">Dietary:</span>
          {DIETARY_FILTERS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleDietary(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                dietaryFilter.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <span className="text-xs text-muted-foreground font-medium">Spice:</span>
          {[0, 1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSpiceFilter(lvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                spiceFilter === lvl
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {SPICE_LABELS[lvl]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((k) => (
              <MenuCardSkeleton key={k} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-muted-foreground text-lg">No items match your filters.</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setDietaryFilter([]);
                setSpiceFilter(0);
              }}
              className="mt-4 text-primary text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={String(item.id)} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}

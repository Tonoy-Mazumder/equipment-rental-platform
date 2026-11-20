"use client"; // needed because we use useState (things that change on screen)

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Building,
  HardHat,
  Heart,
  MapPin,
  Star,
  Tractor,
  Truck,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. DATA                                                             */
/* ------------------------------------------------------------------ */

// This describes what one machine looks like.
type Equipment = {
  name: string;
  slug: string;
  category: string;
  city: string;
  rating: number;
  price: number; // price per day
  available: boolean;
  icon: typeof HardHat;
  color: string; // background gradient (placeholder until real photos)
};

// All machines. Later you can replace this with data from your database.
const allEquipment: Equipment[] = [
  {
    name: "CAT 320 Excavator",
    slug: "cat-320-excavator",
    category: "Excavators",
    city: "Gazipur",
    rating: 4.9,
    price: 185,
    available: true,
    icon: HardHat,
    color: "linear-gradient(135deg, #8a5a1e, #2a1a08)",
  },
  {
    name: "Komatsu D65 Dozer",
    slug: "komatsu-d65-dozer",
    category: "Dozers",
    city: "Dhaka",
    rating: 4.8,
    price: 240,
    available: true,
    icon: Tractor,
    color: "linear-gradient(135deg, #7a6a1e, #2a2408)",
  },
  {
    name: "Bobcat S650 Skid Steer",
    slug: "bobcat-s650-skid-steer",
    category: "Loaders",
    city: "Chattogram",
    rating: 4.7,
    price: 120,
    available: false,
    icon: Box,
    color: "linear-gradient(135deg, #6a5a3a, #2a2418)",
  },
  {
    name: "Genie Z-45 Boom Lift",
    slug: "genie-z-45-boom-lift",
    category: "Aerial Lifts",
    city: "Sylhet",
    rating: 4.9,
    price: 160,
    available: true,
    icon: Building,
    color: "linear-gradient(135deg, #4a6070, #1c262e)",
  },
  {
    name: "Cummins 100kVA Generator",
    slug: "cummins-100kva-generator",
    category: "Power",
    city: "Dhaka",
    rating: 4.6,
    price: 75,
    available: true,
    icon: Zap,
    color: "linear-gradient(135deg, #4a6a4a, #1c2a1c)",
  },
  {
    name: "Volvo A30 Dump Truck",
    slug: "volvo-a30-dump-truck",
    category: "Trucks",
    city: "Khulna",
    rating: 4.8,
    price: 210,
    available: true,
    icon: Truck,
    color: "linear-gradient(135deg, #7a3a28, #2a120c)",
  },
];

// The checkbox names in the Filters box
const categories = ["Excavators", "Dozers", "Loaders", "Aerial Lifts", "Power", "Trucks"];

/* ------------------------------------------------------------------ */
/* 2. ONE MACHINE CARD                                                 */
/* ------------------------------------------------------------------ */

function EquipmentCard({ item }: { item: Equipment }) {
  const Icon = item.icon;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#2f3639] bg-[#1b2124]">
      {/* Top part: colored picture area */}
      <div
        className="relative flex h-44 items-center justify-center"
        style={{ backgroundImage: item.color }}
      >
        {/* Category label (top left) */}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {item.category}
        </span>

        {/* Heart button (top right) - does nothing yet */}
        <button
          type="button"
          aria-label={`Save ${item.name}`}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-neutral-900"
        >
          <Heart className="size-4" />
        </button>

        {/* Big icon in the middle */}
        <Icon className="size-14 text-white/90" strokeWidth={1.5} />
      </div>

      {/* Bottom part: text */}
      <div className="p-4">
        <h3 className="font-semibold text-white">{item.name}</h3>

        {/* City and rating */}
        <div className="mt-1 flex items-center gap-3 text-xs text-[#9a9c96]">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {item.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-[#F28C28] text-[#F28C28]" />
            {item.rating}
          </span>
        </div>

        {/* Price and status */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-white">
            <span className="text-xl font-bold">${item.price}</span>
            <span className="ml-1 text-xs text-[#9a9c96]">/day</span>
          </p>

          {/* Green if available, orange if rented */}
          {item.available ? (
            <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
              Available
            </span>
          ) : (
            <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-300">
              Rented
            </span>
          )}
        </div>

        {/* Link to the details page */}
        <Link
          href={`/equipment/${item.slug}`}
          className="mt-4 block rounded-lg bg-[#F28C28] py-2 text-center text-sm font-semibold text-[#111719] hover:bg-[#e07d1a]"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 3. THE WHOLE PAGE                                                   */
/* ------------------------------------------------------------------ */

export default function BrowseEquipment() {
  // These are the values the user can change. When one changes,
  // React redraws the page automatically.
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState("rating");

  // Called when a checkbox is clicked: add the category, or remove it.
  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  // Step 1: keep only the machines that match the filters.
  const filtered = allEquipment.filter((item) => {
    // If no category is ticked, show all categories.
    const categoryOk =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);

    // City must contain what the user typed (ignore capital letters).
    const locationOk = item.city.toLowerCase().includes(location.toLowerCase());

    // Price must be at or below the slider value.
    const priceOk = item.price <= maxPrice;

    return categoryOk && locationOk && priceOk;
  });

  // Step 2: sort the filtered list.
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return b.rating - a.rating; // default: top rated first
  });

  return (
    <main className="min-h-screen bg-[#111719] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-10">
        {/* Page title */}
        <h1 className="text-3xl font-extrabold tracking-tight">Browse equipment</h1>
        <p className="mt-2 text-[#9a9c96]">
          {sorted.length} machines available near you
        </p>

        {/* Two columns: filters on the left, cards on the right */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* ---------- Filters box ---------- */}
          <aside className="h-fit rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5">
            <h2 className="font-semibold">Filters</h2>

            {/* Category checkboxes */}
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="size-4 accent-[#F28C28]"
                  />
                  {category}
                </label>
              ))}
            </div>

            {/* Location */}
            <label className="mt-5 block text-xs font-semibold text-[#9a9c96]">
              Location
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              />
            </label>

            {/* Available from (the date is not used for filtering yet) */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Available from
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              />
            </label>

            {/* Max price slider */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Max price / day: ${maxPrice}
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-[#F28C28]"
              />
            </label>

            {/* Sort dropdown */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Sort
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              >
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </aside>

          {/* ---------- Cards ---------- */}
          <section>
            {sorted.length === 0 ? (
              <p className="text-[#9a9c96]">No machines match your filters.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((item) => (
                  <EquipmentCard key={item.slug} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
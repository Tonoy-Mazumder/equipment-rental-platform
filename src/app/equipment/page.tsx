
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Building,
  HardHat,
  Heart,
  MapPin,
  Tractor,
  Truck,
  Zap,
} from "lucide-react";

import {
  getEquipment,
  type Equipment,
} from "@/lib/api/equipment";
import { addFavorite, getFavorites } from "@/lib/api/favorites";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
// Equipment category styles
function getEquipmentStyle(category: string) {
  const styles: Record<
    string,
    { icon: typeof HardHat; color: string }
  > = {
    Excavators: {
      icon: HardHat,
      color: "linear-gradient(135deg, #8a5a1e, #2a1a08)",
    },
    Dozers: {
      icon: Tractor,
      color: "linear-gradient(135deg, #7a6a1e, #2a2408)",
    },
    Loaders: {
      icon: Box,
      color: "linear-gradient(135deg, #6a5a3a, #2a2418)",
    },
    "Aerial Lifts": {
      icon: Building,
      color: "linear-gradient(135deg, #4a6070, #1c262e)",
    },
    Power: {
      icon: Zap,
      color: "linear-gradient(135deg, #4a6a4a, #1c2a1c)",
    },
    Trucks: {
      icon: Truck,
      color: "linear-gradient(135deg, #7a3a28, #2a120c)",
    },
  };

  return (
    styles[category] ?? {
      icon: HardHat,
      color: "linear-gradient(135deg, #4a6070, #1c262e)",
    }
  );
}

// Equipment card

function EquipmentCard({ item }: { item: Equipment }) {
  const { icon: Icon, color } = getEquipmentStyle(item.category);

  const { data: session } = authClient.useSession();
  const isCustomer = session?.user?.role === "customer";

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsFavorite(false);
      return;
    }

    async function checkFavorite() {
      try {
        const favorites = await getFavorites();

        const exists = favorites.some(
          (favorite: { equipmentId: string }) =>
            favorite.equipmentId === item._id,
        );

        setIsFavorite(exists);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      }
    }

    checkFavorite();
  }, [session?.user?.id, item._id]);

  async function handleFavorite() {
    if (!session?.user?.id) {
      toast.add({
        title: "Login required",
        description: "Please login to add favorites.",
        type: "warning",
      });
      return;
    }

    if (isFavorite || favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      await addFavorite(item._id);
      setIsFavorite(true);

      toast.add({
        title: "Success",
        description: "Equipment added to favorites.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add favorite",
        type: "error",
      });
    } finally {
      setFavoriteLoading(false);
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#2f3639] bg-[#1b2124]">
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={{ backgroundImage: color }}
      >
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className="size-14 text-white/90" strokeWidth={1.5} />
        )}

        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {item.category}
        </span>

        {isCustomer && (
          <button
            type="button"
            onClick={handleFavorite}
            disabled={favoriteLoading || isFavorite}
            aria-label={
              isFavorite
                ? "Already in favorites"
                : `Save ${item.name}`
            }
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Heart
              className={`size-4 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white">{item.name}</h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-[#9a9c96]">
          <MapPin className="size-3.5" />
          {item.location}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-white">
            <span className="text-xl font-bold">
              ${item.pricePerDay}
            </span>
            <span className="ml-1 text-xs text-[#9a9c96]">
              /day
            </span>
          </p>

          {item.status === "available" ? (
            <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
              Available
            </span>
          ) : (
            <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-300">
              Rented
            </span>
          )}
        </div>

        <Link
          href={`/equipment/${item._id}`}
          className="mt-4 block rounded-lg bg-[#F28C28] py-2 text-center text-sm font-semibold text-[#111719] hover:bg-[#e07d1a]"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

// Browse equipment page
export default function BrowseEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("price-low");

  // Fetch equipment
  useEffect(() => {
    async function loadEquipment() {
      try {
        const data = await getEquipment();
        setEquipment(data);
      } catch {
        setError("Failed to load equipment. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadEquipment();
  }, []);

  // Get categories from database
  const categories = [
    ...new Set(equipment.map((item) => item.category)),
  ];

  // Toggle category filter
  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  // Filter equipment
  const filtered = equipment.filter((item) => {
    const categoryOk =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);

    const locationOk = item.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const priceOk = item.pricePerDay <= maxPrice;

    return categoryOk && locationOk && priceOk;
  });

  // Sort equipment
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.pricePerDay - b.pricePerDay;
    }

    if (sortBy === "price-high") {
      return b.pricePerDay - a.pricePerDay;
    }

    return 0;
  });

  return (
    <main className="min-h-screen bg-[#111719] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-10">

        {/* Page title */}
        <h1 className="text-3xl font-extrabold tracking-tight">
          Browse equipment
        </h1>

        <p className="mt-2 text-[#9a9c96]">
          {loading
            ? "Loading equipment..."
            : `${sorted.length} machines found`}
        </p>

        {/* Filters and equipment cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* Filters */}
          <aside className="h-fit rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5">
            <h2 className="font-semibold">Filters</h2>

            {/* Categories */}
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm"
                >
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
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or area"
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              />
            </label>

            {/* Available date */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Available from

              <input
                type="date"
                value={availableFrom}
                onChange={(event) => setAvailableFrom(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              />
            </label>

            {/* Maximum price */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Max price / day: ${maxPrice}

              <input
                type="range"
                min={50}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="mt-2 w-full accent-[#F28C28]"
              />
            </label>

            {/* Sorting */}
            <label className="mt-4 block text-xs font-semibold text-[#9a9c96]">
              Sort

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2 text-sm font-normal text-white"
              >
                <option value="price-low">
                  Price: low to high
                </option>

                <option value="price-high">
                  Price: high to low
                </option>
              </select>
            </label>
          </aside>

          {/* Equipment cards */}
          <section>
            {loading ? (
              <p className="text-[#9a9c96]">
                Loading equipment...
              </p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : sorted.length === 0 ? (
              <p className="text-[#9a9c96]">
                No machines match your filters.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((item) => (
                  <EquipmentCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

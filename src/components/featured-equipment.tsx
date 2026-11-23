
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building,
  Box,
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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getEquipmentIcon(category: string) {
  const icons: Record<string, typeof HardHat> = {
    Excavators: HardHat,
    Dozers: Tractor,
    Loaders: Box,
    "Aerial Lifts": Building,
    Power: Zap,
    Trucks: Truck,
  };

  return icons[category] || HardHat;
}

function EquipmentCard({ item }: { item: Equipment }) {
  const Icon = getEquipmentIcon(item.category);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2f3639] bg-background/5 transition-colors hover:border-[#4a5256]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#252b2e]">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon className="size-14 text-white/80" strokeWidth={1.5} />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold">{item.name}</h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-background/60">
          <MapPin className="size-3.5" />
          {item.location}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p>
            <span className="text-xl font-bold">
              ${item.pricePerDay}
            </span>
            <span className="ml-1 text-xs text-background/50">
              /day
            </span>
          </p>

          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              item.status === "available"
                ? "bg-[#F28C28]/15 text-[#F28C28]"
                : "bg-white/10 text-white/70"
            )}
          >
            {item.status === "available" ? "Available" : "Rented"}
          </span>
        </div>

        <Link
          href={`/equipment/${item._id}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-4 h-10 w-full bg-[#F28C28] font-medium text-[#111719] hover:bg-[#e07d1a]"
          )}
        >
          View details
        </Link>
      </div>
    </article>
  );
}

export function FeaturedEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEquipment() {
      try {
        const data = await getEquipment();
        setEquipment(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured equipment:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEquipment();
  }, []);

  return (
    <section
      aria-labelledby="featured-equipment-heading"
      className="mx-auto w-full max-w-5xl px-4 pt-16 pb-20 sm:px-6 lg:px-8"
    >
      <div className="flex items-end justify-between gap-4">
        <h2
          id="featured-equipment-heading"
          className="text-section font-bold tracking-tight"
        >
          Featured equipment
        </h2>

        <Link
          href="/equipment"
          className="rounded-lg border border-background/10 bg-background/5 px-3 py-1.5 text-sm text-background/80 transition-colors hover:bg-background/10 hover:text-background"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-background/60">
          Loading equipment...
        </p>
      ) : equipment.length === 0 ? (
        <p className="mt-6 text-sm text-background/60">
          No equipment available right now.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

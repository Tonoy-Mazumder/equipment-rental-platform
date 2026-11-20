import Link from "next/link";
import {
  Building,
  HardHat,
  Heart,
  MapPin,
  Star,
  Tractor,
  Truck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Equipment = {
  name: string;
  slug: string;
  category: string;
  city: string;
  rating: number;
  price: number;
  icon: typeof HardHat;
  // Placeholder artwork colour until real photos are available.
  art: string;
};

type EquipmentCardProps = {
  equipment: Equipment;
};

const featuredEquipment: Equipment[] = [
  {
    name: "CAT 320 Excavator",
    slug: "cat-320-excavator",
    category: "Excavators",
    city: "Gazipur",
    rating: 4.9,
    price: 185,
    icon: HardHat,
    art: "linear-gradient(135deg, #8a5a1e 0%, #4a2f0e 55%, #2a1a08 100%)",
  },
  {
    name: "Komatsu D65 Dozer",
    slug: "komatsu-d65-dozer",
    category: "Dozers",
    city: "Dhaka",
    rating: 4.8,
    price: 240,
    icon: Tractor,
    art: "linear-gradient(135deg, #7a6a1e 0%, #4a3f0e 55%, #2a2408 100%)",
  },
  {
    name: "Genie Z-45 Boom Lift",
    slug: "genie-z-45-boom-lift",
    category: "Aerial Lifts",
    city: "Sylhet",
    rating: 4.9,
    price: 160,
    icon: Building,
    art: "linear-gradient(135deg, #4a6070 0%, #2f3f4a 55%, #1c262e 100%)",
  },
  {
    name: "Volvo A30 Dump Truck",
    slug: "volvo-a30-dump-truck",
    category: "Trucks",
    city: "Khulna",
    rating: 4.8,
    price: 210,
    icon: Truck,
    art: "linear-gradient(135deg, #7a3a28 0%, #4a2018 55%, #2a120c 100%)",
  },
];

function EquipmentCard({ equipment }: EquipmentCardProps) {
  const Icon = equipment.icon;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#2f3639] bg-background/5 transition-colors hover:border-[#4a5256]">
      <div
        className="relative aspect-[4/3]"
        style={{ backgroundImage: equipment.art }}
      >
        <div className="equipment-art-stripes absolute inset-0" aria-hidden="true" />

        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {equipment.category}
        </span>

        {/* Favourites are not implemented yet. */}
        <button
          type="button"
          aria-label={`Save ${equipment.name}`}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          <Heart aria-hidden="true" className="size-4" />
        </button>

        <Icon
          aria-hidden="true"
          strokeWidth={1.5}
          className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white/90"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold">{equipment.name}</h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-background/60">
          <span className="flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3.5" />
            {equipment.city}
          </span>
          <span className="flex items-center gap-1">
            <Star aria-hidden="true" className="size-3.5 fill-brand text-brand" />
            {equipment.rating}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p>
            <span className="text-xl font-bold">${equipment.price}</span>
            <span className="ml-1 text-xs text-background/50">/day</span>
          </p>
          <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
            Available
          </span>
        </div>

        <Link
          href={`/equipment/${equipment.slug}`}
          className={cn(
            buttonVariants({ variant: "brand" }),
            "mt-4 h-10 w-full font-medium"
          )}
        >
          View details
        </Link>
      </div>
    </article>
  );
}

export function FeaturedEquipment() {
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

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredEquipment.map((equipment) => (
          <EquipmentCard key={equipment.slug} equipment={equipment} />
        ))}
      </div>
    </section>
  );
}

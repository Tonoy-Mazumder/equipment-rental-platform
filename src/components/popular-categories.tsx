import Link from "next/link";
import { Box, Building, HardHat, Tractor, Truck, Zap } from "lucide-react";

type Category = {
  label: string;
  slug: string;
  icon: typeof HardHat;
};

const categories: Category[] = [
  { label: "Excavators", slug: "excavators", icon: HardHat },
  { label: "Dozers", slug: "dozers", icon: Tractor },
  { label: "Loaders", slug: "loaders", icon: Box },
  { label: "Aerial Lifts", slug: "aerial-lifts", icon: Building },
  { label: "Power", slug: "power", icon: Zap },
  { label: "Trucks", slug: "trucks", icon: Truck },
];

export function PopularCategories() {
  return (
    <section
      aria-labelledby="popular-categories-heading"
      className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 lg:px-8"
    >
      <h2
        id="popular-categories-heading"
        className="text-section font-bold tracking-tight"
      >
        Popular categories
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ label, slug, icon: Icon }) => (
          <Link
            key={slug}
            href={`/equipment?category=${slug}`}
           className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-[#2f3639] bg-background/5 transition-colors hover:border-[#4a5256] hover:bg-background/10"
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-7 text-brand"
            />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

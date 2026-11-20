import {
  CreditCard,
  DollarSign,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

type Benefit = {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
};

type Stat = {
  value: string;
  label: string;
  star?: boolean;
};

const benefits: Benefit[] = [
  {
    title: "Verified owners",
    description: "ID and equipment checks on every listing.",
    icon: ShieldCheck,
  },
  {
    title: "Secure payments",
    description: "Escrow-style payouts via Stripe.",
    icon: CreditCard,
  },
  {
    title: "Real support",
    description: "Humans on call 7 days a week.",
    icon: Phone,
  },
  {
    title: "Fair pricing",
    description: "No hidden fees. Owners keep 90%.",
    icon: DollarSign,
  },
];

const stats: Stat[] = [
  { value: "2,400+", label: "Machines listed" },
  { value: "12k", label: "Active renters" },
  { value: "38", label: "Cities covered" },
  { value: "4.8", label: "Average rating", star: true },
];

export function WhyChooseRentPro() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="mx-auto w-full max-w-5xl px-4 pt-16 pb-20 sm:px-6 lg:px-8"
    >
      <h2
        id="why-choose-heading"
        className="text-section font-bold tracking-tight"
      >
        Why choose RentPro
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="min-h-40 rounded-xl border border-background/10 bg-background/5 p-5"
          >
            <Icon aria-hidden="true" className="size-6 text-brand" />
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-background/60">
              {description}
            </p>
          </div>
        ))}
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="text-center">
            <p className="flex items-center justify-center gap-1 text-4xl font-bold text-brand">
              {stat.value}
              {stat.star && (
                <Star aria-hidden="true" className="size-7 fill-brand" />
              )}
            </p>
            <p className="mt-1 text-sm font-medium">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

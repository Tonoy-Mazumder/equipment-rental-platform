import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { label: "Earnings (Nov)", value: "$3,420", note: "+18%" },
  { label: "Active rentals", value: "4", note: "2 returning" },
  { label: "Pending requests", value: "3", note: "Reply today" },
  { label: "Utilisation", value: "72%", note: "+6%" },
];

const revenue = [
  { month: "Jun", height: 45 },
  { month: "Jul", height: 60 },
  { month: "Aug", height: 53 },
  { month: "Sep", height: 78 },
  { month: "Oct", height: 66 },
  { month: "Nov", height: 100 },
];

const requests = [
  "Rafiq A. — CAT 320, Nov 24",
  "Nusrat J. — Dozer, Nov 28",
  "Karim S. — Lift, Dec 1",
];

export default function OwnerDashboardPage() {
  return (
    <div className="dark -m-5 min-h-full bg-background p-5 text-foreground md:-m-8 md:p-8">
      {/* Search + avatar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          type="search"
          placeholder="Search bookings, equipment..."
          className="h-10 w-full max-w-sm rounded-lg bg-input/30"
        />
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
          TM
        </span>
      </div>

      {/* Page title */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Owner overview</h1>
        <Button
          variant="default"
          className="h-9 rounded-full px-4 text-sm font-semibold text-white"
        >
          + Add equipment
        </Button>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-emerald-400">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue + requests */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly revenue bar chart */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Revenue</h2>

          <div className="mt-6 flex h-44 items-end gap-3 sm:gap-5">
            {revenue.map((item) => (
              <div
                key={item.month}
                style={{ height: `${item.height}%` }}
                className="flex-1 bg-brand"
              />
            ))}
          </div>

          <div className="mt-3 flex gap-3 sm:gap-5">
            {revenue.map((item) => (
              <span
                key={item.month}
                className="flex-1 text-center text-xs text-muted-foreground"
              >
                {item.month}
              </span>
            ))}
          </div>
        </section>

        {/* Recent rental requests */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">New requests</h2>

          <ul className="mt-4 space-y-4">
            {requests.map((request) => (
              <li
                key={request}
                className="border-l-2 border-brand pl-4 text-[15px]"
              >
                {request}
              </li>
            ))}
          </ul>

          <Button variant="default" className="mt-6 h-9 px-4 text-sm font-semibold">
            Review
          </Button>
        </section>
      </div>
    </div>
  );
}

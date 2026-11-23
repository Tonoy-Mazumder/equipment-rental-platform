
"use client";

import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import {
  Users,
  Package,
  CalendarDays,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import {
  getAdminAnalytics,
  type AdminAnalytics,
} from "@/lib/api/admin";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>

        <div className="rounded-lg bg-brand/10 p-2 text-brand">
          <Icon size={20} />
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-bold text-foreground">
        {value}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

type BreakdownItemProps = {
  label: string;
  value: number;
  icon: React.ElementType;
};

function BreakdownItem({
  label,
  value,
  icon: Icon,
}: BreakdownItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon size={17} />
        {label}
      </div>

      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

const months = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

function MonthlyBookingChart({
  monthlyStats,
}: {
  monthlyStats: AdminAnalytics["monthlyBookingStats"];
}) {
  const maximumBookings = Math.max(
    1,
    ...monthlyStats.map((item) => item.total)
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Monthly Booking Statistics
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Booking activity throughout the current year.
        </p>
      </div>

      <div className="grid h-64 grid-cols-12 items-end gap-2 sm:gap-4">
        {months.map((month, index) => {
          const total =
            monthlyStats.find((item) => item.month === index + 1)?.total || 0;

          const height =
            total === 0 ? 0 : Math.max(5, (total / maximumBookings) * 100);

          return (
            <div
              key={month}
              className="flex h-full min-w-0 flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {total}
              </span>

              <div className="flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-md bg-brand transition-all duration-300"
                  style={{ height: `${height}%` }}
                  title={`${month}: ${total} bookings`}
                />
              </div>

              <span className="text-[10px] text-muted-foreground sm:text-xs">
                {month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load admin analytics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <Loading />;
  }

  if (error || !analytics) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium text-destructive">
          {error || "Analytics data not found."}
        </p>

        <button
          onClick={fetchAnalytics}
          className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Admin Overview
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your RentPro platform activities.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics.users.total.toLocaleString()}
          description={`${analytics.users.customers} customers · ${analytics.users.owners} owners`}
          icon={Users}
        />

        <StatCard
          title="Total Equipment"
          value={analytics.equipment.total.toLocaleString()}
          description={`${analytics.equipment.approved} approved equipment`}
          icon={Package}
        />

        <StatCard
          title="Total Rentals"
          value={analytics.rentals.total.toLocaleString()}
          description={`${analytics.rentals.completed} completed rentals`}
          icon={CalendarDays}
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          description="From successful payments"
          icon={DollarSign}
        />
      </div>

      {/* Monthly Booking Chart */}
      <MonthlyBookingChart
        monthlyStats={analytics.monthlyBookingStats}
      />

      {/* Detailed Statistics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            User Statistics
          </h2>

          <BreakdownItem
            label="Customers"
            value={analytics.users.customers}
            icon={Users}
          />

          <BreakdownItem
            label="Owners"
            value={analytics.users.owners}
            icon={Package}
          />

          <BreakdownItem
            label="Admins"
            value={analytics.users.admins}
            icon={ShieldCheck}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Equipment Statistics
          </h2>

          <BreakdownItem
            label="Pending"
            value={analytics.equipment.pending}
            icon={Clock}
          />

          <BreakdownItem
            label="Approved"
            value={analytics.equipment.approved}
            icon={CheckCircle2}
          />

          <BreakdownItem
            label="Rejected"
            value={analytics.equipment.rejected}
            icon={XCircle}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Rental Statistics
          </h2>

          <BreakdownItem
            label="Pending"
            value={analytics.rentals.pending}
            icon={Clock}
          />

          <BreakdownItem
            label="Approved"
            value={analytics.rentals.approved}
            icon={CheckCircle2}
          />

          <BreakdownItem
            label="Completed"
            value={analytics.rentals.completed}
            icon={CheckCircle2}
          />

          <BreakdownItem
            label="Cancelled"
            value={analytics.rentals.cancelled}
            icon={XCircle}
          />
        </div>
      </div>
    </div>
  );
}

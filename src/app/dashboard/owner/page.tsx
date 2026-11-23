
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOwnerEarnings } from "@/lib/api/earnings";
import { getOwnerBookings } from "@/lib/api/booking";
import type { EarningsData } from "@/lib/api/earnings";

type Booking = Awaited<ReturnType<typeof getOwnerBookings>>[number];

export default function OwnerDashboardPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [earningsData, bookingData] = await Promise.all([
        getOwnerEarnings(),
        getOwnerBookings(),
      ]);

      setEarnings(earningsData);
      setBookings(bookingData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const activeRentals = bookings.filter(
    (booking) => booking.status === "approved",
  );

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "pending",
  );

  const stats = [
    {
      label: "Earnings (This Month)",
      value: `$${(earnings?.thisMonthEarnings ?? 0).toLocaleString()}`,
      note: "Completed rentals",
    },
    {
      label: "Active rentals",
      value: activeRentals.length.toString(),
      note: "Currently approved",
    },
    {
      label: "Pending requests",
      value: pendingRequests.length.toString(),
      note: "Waiting for your response",
    },
    {
      label: "Completed rentals",
      value: (earnings?.completedRentals ?? 0).toString(),
      note: "Successfully completed",
    },
  ];

  const currentMonth = new Date().getMonth();

  const revenue = (earnings?.monthlyEarnings ?? [])
    .slice(0, currentMonth + 1)
    .slice(-6);

  const maxRevenue = Math.max(
    ...revenue.map((item) => item.earnings),
    1,
  );

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={loadDashboard}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
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
        <h1 className="text-2xl font-bold tracking-tight">
          Owner overview
        </h1>

        <Link
          href="/dashboard/owner/equipment/add"
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand transition-colors hover:bg-brand hover:text-white"
        >
          + Add equipment
        </Link>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground">
              {stat.label}
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {stat.value}
            </p>

            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue + requests */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly revenue chart */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Revenue</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Monthly earnings from completed rentals
          </p>

          {revenue.length > 0 ? (
            <>
              <div className="mt-6 flex h-44 items-end gap-3 sm:gap-5">
                {revenue.map((item) => (
                  <div
                    key={item.month}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      className="w-full rounded-t-md bg-brand"
                      style={{
                        height: `${Math.max(
                          (item.earnings / maxRevenue) * 100,
                          item.earnings > 0 ? 4 : 0,
                        )}%`,
                      }}
                      title={`$${item.earnings.toLocaleString()}`}
                    />
                  </div>
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
            </>
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No revenue data available yet.
            </p>
          )}
        </section>

        {/* Recent rental requests */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">New requests</h2>

            <Link
              href="/dashboard/owner/requests"
              className="text-sm font-medium text-brand hover:underline"
            >
              View all
            </Link>
          </div>

          {pendingRequests.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {pendingRequests.slice(0, 4).map((booking) => (
                <li
                  key={booking._id}
                  className="border-l-2 border-brand pl-4"
                >
                  <p className="text-sm font-medium">
                    {booking.equipmentName || "Equipment rental"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.customerName || "Customer"}{" "}
                    {booking.startDate
                      ? `— ${formatDate(booking.startDate)}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No pending requests at the moment.
            </p>
          )}

          <Link href="/dashboard/owner/requests">
            <Button className="mt-6 h-9 px-4 text-sm font-semibold">
              Review requests
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

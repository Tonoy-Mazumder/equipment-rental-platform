
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Heart,
  Package,
  Clock,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { Loading } from "@/components/loading";
import { getCustomerBookings, type Booking } from "@/lib/api/booking";
import { getEquipment } from "@/lib/api/equipment";
import { getFavorites } from "@/lib/api/favorites";

type BookingItem = Booking & {
  equipmentName: string;
};

type Favorite = {
  _id: string;
  equipmentId: string;
  equipment: {
    name: string;
    location: string;
    pricePerDay: number;
  };
};

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [bookingData, equipmentData, favoriteData] =
          await Promise.all([
            getCustomerBookings(),
            getEquipment(),
            getFavorites(),
          ]);

        const bookingItems = bookingData.map((booking) => {
          const equipment = equipmentData.find(
            (item) => item._id === booking.equipmentId
          );

          return {
            ...booking,
            equipmentName:
              equipment?.name || booking.equipmentName || "Equipment",
          };
        });

        setBookings(bookingItems);
        setFavorites(favoriteData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "pending" || booking.status === "approved"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return <Loading label="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      href: "/dashboard/customer/bookings",
    },
    {
      label: "Upcoming Rentals",
      value: upcomingBookings.length,
      icon: Clock,
      href: "/dashboard/customer/bookings",
    },
    {
      label: "Completed Rentals",
      value: completedBookings.length,
      icon: Package,
      href: "/dashboard/customer/bookings",
    },
    {
      label: "Saved Favorites",
      value: favorites.length,
      icon: Heart,
      href: "/dashboard/customer/favorites",
    },
  ];

  return (
    <div className="min-w-0 space-y-8">
      {/* Welcome */}
      <div>
        <p className="text-sm font-semibold text-primary">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Welcome back!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your equipment rentals and keep track of your bookings.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-bold">Quick Access</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/customer/bookings"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div>
              <CalendarDays className="mb-3 text-primary" size={24} />
              <h3 className="font-semibold">My Rentals</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View your bookings
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard/customer/favorites"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div>
              <Heart className="mb-3 text-primary" size={24} />
              <h3 className="font-semibold">My Favorites</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View saved equipment
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard/customer/profile"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div>
              <Package className="mb-3 text-primary" size={24} />
              <h3 className="font-semibold">My Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-bold">Recent Bookings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest equipment rental activity
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="font-semibold">No bookings yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your equipment bookings will appear here.
            </p>

            <Link
              href="/browse-equipment"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {booking.equipmentName}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Booking ID: BK-{booking._id.slice(-4).toUpperCase()}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div>
                    <p className="font-bold">
                      ${booking.totalPrice.toLocaleString()}
                    </p>

                    <span className="text-xs capitalize text-muted-foreground">
                      {booking.status}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/customer/bookings/${booking._id}`}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favorite Equipment */}
      {favorites.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Favorite Equipment</h2>

            <Link
              href="/dashboard/customer/favorites"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.slice(0, 3).map((favorite) => (
              <div
                key={favorite._id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {favorite.equipment?.name || "Equipment"}
                    </h3>

                    <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      {favorite.equipment?.location || "Location unavailable"}
                    </p>
                  </div>

                  <Heart size={19} className="shrink-0 fill-primary text-primary" />
                </div>

                <p className="mt-4 text-lg font-bold">
                  ${favorite.equipment?.pricePerDay || 0}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}/ day
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

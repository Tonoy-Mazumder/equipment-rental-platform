
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import {
  Search,
  CalendarDays,
  Package,
  Users,
} from "lucide-react";

import {
  getAdminRentals,
  updateAdminRentalStatus,
  type AdminRental,
} from "@/lib/api/admin";

import { toast } from "@/components/ui/toast";

const rentalStatuses = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    async function loadRentals() {
      try {
        const data = await getAdminRentals();
        setRentals(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load rentals"
        );
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, []);

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      `${rental.equipmentName} ${rental.customerName} ${rental.customerEmail} ${rental.ownerName} ${rental._id}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || rental.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = rentals.filter(
    (rental) => rental.status === "pending"
  ).length;

  const approvedCount = rentals.filter(
    (rental) => rental.status === "approved"
  ).length;

  const cancelledCount = rentals.filter(
    (rental) => rental.status === "cancelled"
  ).length;

  function getStatusStyle(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-500/15 text-green-400";
      case "pending":
        return "bg-yellow-500/15 text-yellow-400";
      case "rejected":
        return "bg-red-500/15 text-red-400";
      case "cancelled":
        return "bg-gray-500/15 text-gray-400";
      case "completed":
        return "bg-blue-500/15 text-blue-400";
      default:
        return "bg-orange-500/15 text-orange-400";
    }
  }

  function getPaymentStatusStyle(status: string) {
    switch (status) {
      case "paid":
        return "bg-green-500/15 text-green-400";
      case "unpaid":
        return "bg-yellow-500/15 text-yellow-400";
      case "failed":
        return "bg-red-500/15 text-red-400";
      default:
        return "bg-gray-500/15 text-gray-400";
    }
  }

  // Update rental booking status by admin
  async function handleStatusUpdate(
    rentalId: string,
    newStatus: string
  ) {
    const currentRental = rentals.find(
      (rental) => rental._id === rentalId
    );

    if (!currentRental || currentRental.status === newStatus) {
      return;
    }

    try {
      setUpdatingId(rentalId);

      await updateAdminRentalStatus(rentalId, newStatus);

      setRentals((previousRentals) =>
        previousRentals.map((rental) =>
          rental._id === rentalId
            ? { ...rental, status: newStatus }
            : rental
        )
      );

      toast.add({
        title: "Success",
        description: "Rental status updated successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update rental status.",
        type: "error",
      });
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">All Rentals</h1>
        <p className="mt-1 text-sm text-gray-400">
          Monitor and manage all equipment rental bookings.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Rentals"
          value={rentals.length}
          icon={<CalendarDays className="size-5" />}
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<CalendarDays className="size-5" />}
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<Package className="size-5" />}
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          icon={<Users className="size-5" />}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment, customer or owner..."
            className="h-11 w-full rounded-lg border border-white/10 bg-[#222222] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-lg border border-white/10 bg-[#222222] px-4 text-sm text-white outline-none focus:border-orange-500"
        >
          <option value="all">All Status</option>
          {rentalStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Rentals Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#222222]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Rental Records</h2>
          <p className="mt-1 text-sm text-gray-400">
            {filteredRentals.length} rentals found
          </p>
        </div>

        {loading ? (
          <Loading className="min-h-0 py-16" label="Loading rentals..." />
        ) : error ? (
          <div className="py-16 text-center text-red-400">
            {error}
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No rentals found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#292929] text-gray-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Equipment</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Owner</th>
                  <th className="px-5 py-4 font-medium">Rental Period</th>
                  <th className="px-5 py-4 font-medium">Total</th>
                  <th className="px-5 py-4 font-medium">Payment</th>
                  <th className="px-5 py-4 font-medium">Booking Status</th>
                  <th className="px-5 py-4 font-medium">Manage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredRentals.map((rental) => {
                  const paymentStatus =
                    rental.paymentStatus || "unpaid";

                  return (
                    <tr
                      key={rental._id}
                      className="transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <p className="min-w-[140px] font-medium text-white">
                          {rental.equipmentName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          ID: {rental._id.slice(-8)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="min-w-[150px] font-medium text-white">
                          {rental.customerName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {rental.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="min-w-[150px] font-medium text-white">
                          {rental.ownerName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {rental.ownerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        <p className="whitespace-nowrap">
                          {new Date(rental.startDate).toLocaleDateString("en-GB")}
                        </p>
                        <p className="mt-1 whitespace-nowrap">
                          to {new Date(rental.endDate).toLocaleDateString("en-GB")}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-orange-500">
                        ৳{rental.totalPrice.toLocaleString("en-BD")}
                      </td>

                      {/* Payment Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getPaymentStatusStyle(paymentStatus)}`}
                        >
                          {paymentStatus}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(rental.status)}`}
                        >
                          {rental.status}
                        </span>
                      </td>

                      {/* Manage Rental */}
                      <td className="px-5 py-4">
                        <select
                          value={rental.status}
                          disabled={updatingId === rental._id}
                          onChange={(e) =>
                            handleStatusUpdate(
                              rental._id,
                              e.target.value
                            )
                          }
                          className="h-9 min-w-[125px] rounded-lg border border-white/10 bg-[#292929] px-2 text-xs text-white outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {rentalStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>

                        {updatingId === rental._id && (
                          <p className="mt-1 text-xs text-orange-400">
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#222222] p-5 transition-colors hover:border-orange-500/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <span className="text-orange-500">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

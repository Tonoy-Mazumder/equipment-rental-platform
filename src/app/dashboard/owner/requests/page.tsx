
"use client";

import { useEffect, useState } from "react";
import {
  getOwnerBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/api/booking";
import { toast } from "@/components/ui/toast";

export default function OwnerRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getOwnerBookings();
        setBookings(data);
      } catch (error) {
        toast.add({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load rental requests.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  async function handleStatusUpdate(
    bookingId: string,
    status: "approved" | "rejected",
  ) {
    try {
      setUpdatingId(bookingId);

      await updateBookingStatus(bookingId, status);

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking,
        ),
      );

      toast.add({
        title: "Success",
        description: `Booking ${status} successfully.`,
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update booking.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <p className="p-6">Loading rental requests...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="text-muted-foreground">
          Manage equipment rental requests from customers.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center">
          <h2 className="font-semibold">No rental requests yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Customer booking requests will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-background">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Equipment</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Rental Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">
                      {booking.customerName || "Unknown Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerEmail || booking.customerId}
                    </p>
                  </td>

                  <td className="p-4">
                    <p className="font-medium">
                      {booking.equipmentName || "Unknown Equipment"}
                    </p>
                  </td>

                  <td className="p-4">
                    {booking._id.slice(-8)}
                  </td>

                  <td className="p-4">
                    <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">
                      to {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="p-4 font-medium">
                    ${booking.totalPrice}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {booking.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={updatingId !== null}
                          onClick={() =>
                            handleStatusUpdate(booking._id, "approved")
                          }
                          className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingId === booking._id
                            ? "Updating..."
                            : "Approve"}
                        </button>

                        <button
                          disabled={updatingId !== null}
                          onClick={() =>
                            handleStatusUpdate(booking._id, "rejected")
                          }
                          className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No action available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

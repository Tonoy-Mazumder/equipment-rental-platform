
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getOwnerBookings, type Booking } from "@/lib/api/booking";

export default function OwnerRequestsPage() {
    const { data: session } = authClient.useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const ownerId = session?.user?.id || '';

        if (!ownerId) return;

        async function loadBookings() {
            try {
                setLoading(true);
                const data = await getOwnerBookings(ownerId);
                setBookings(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load requests"
                );
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, [session?.user?.id]);

    if (loading) {
        return <p className="p-6">Loading rental requests...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-500">{error}</p>;
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
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Booking ID</th>
                                <th className="p-4">Rental Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
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
                                        {booking._id.slice(-8)}
                                    </td>

                                    <td className="p-4">
                                        <p>{booking.startDate}</p>
                                        <p className="text-muted-foreground">
                                            to {booking.endDate}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

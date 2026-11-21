
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getOwnerRentalHistory, type Booking } from "@/lib/api/booking";
import { toast } from "@/components/ui/toast";
import { Search, History, CalendarDays } from "lucide-react";

export default function OwnerRentalHistoryPage() {
    const { data: session } = authClient.useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    useEffect(() => {
        const ownerId = session?.user?.id;

        if (!ownerId) {
            setLoading(false);
            return;
        }

        async function loadHistory(id: string) {
            try {
                const data = await getOwnerRentalHistory(id);
                setBookings(data);
            } catch {
                toast.add({
                    title: "Error",
                    description: "Failed to load rental history.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        }

        loadHistory(ownerId);
    }, [session?.user?.id]);

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.equipmentName?.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            booking._id.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            status === "all" || booking.status === status;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return <p className="p-6">Loading rental history...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <History className="h-6 w-6 text-brand" />
                    <h1 className="text-2xl font-bold">Rental History</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    View all rental activities for your equipment.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Total Rentals</p>
                    <h2 className="mt-2 text-3xl font-bold">{bookings.length}</h2>
                </div>

                <div className="rounded-xl border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <h2 className="mt-2 text-3xl font-bold">
                        ${bookings
                            .filter((booking) => booking.status === "completed")
                            .reduce((total, booking) => total + booking.totalPrice, 0)
                            .toLocaleString()}
                    </h2>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search equipment or customer..."
                        className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:border-brand"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-11 rounded-lg border bg-background px-4 text-sm outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center">
                    <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h2 className="mt-3 font-semibold">No rental history found</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Rental records will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-background">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="p-4">Equipment</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Rental Period</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} className="border-b last:border-0">
                                    <td className="p-4">
                                        <p className="font-medium">
                                            {booking.equipmentName || "Unknown Equipment"}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            #{booking._id.slice(-8)}
                                        </p>
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium">
                                            {booking.customerName || "Unknown Customer"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {booking.customerEmail || booking.customerId}
                                        </p>
                                    </td>

                                    <td className="p-4">
                                        <p>{formatDate(booking.startDate)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            to {formatDate(booking.endDate)}
                                        </p>
                                    </td>

                                    <td className="p-4 font-semibold">
                                        ${booking.totalPrice.toLocaleString()}
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

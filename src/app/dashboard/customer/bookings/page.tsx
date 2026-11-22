
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
    getCustomerBookings,
    cancelBooking,
    type Booking,
} from "@/lib/api/booking";
import { getEquipment } from "@/lib/api/equipment";
import { toast } from "@/components/ui/toast";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BookingTab = "all" | "upcoming" | "completed" | "cancelled";

type BookingItem = Booking & {
    equipmentName: string;
};

const tabs: { label: string; value: BookingTab }[] = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

// Format booking dates
function formatDate(startDate: string, endDate: string) {
    const start = new Date(startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
    });

    const end = new Date(endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        timeZone: "UTC",
    });

    return `${start} - ${end}`;
}

// Get booking status
function getStatus(status: Booking["status"]) {
    if (status === "approved") {
        return {
            label: "Confirmed",
            color: "bg-green-500/10 text-green-400",
        };
    }

    if (status === "pending") {
        return {
            label: "Pending",
            color: "bg-amber-500/10 text-amber-400",
        };
    }

    if (status === "completed") {
        return {
            label: "Completed",
            color: "bg-gray-500/20 text-gray-400",
        };
    }

    return {
        label: "Cancelled",
        color: "bg-red-500/10 text-red-400",
    };
}

export default function CustomerBookingsPage() {
    const router = useRouter();

    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [activeTab, setActiveTab] = useState<BookingTab>("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState("");
    const [selectedBooking, setSelectedBooking] = useState("");

    // Load customer bookings
    useEffect(() => {
        async function loadBookings() {
            try {
                setLoading(true);
                setError("");

                const bookingData = await getCustomerBookings();
                const equipmentData = await getEquipment();

                const bookingItems = bookingData.map((booking) => {
                    const equipment = equipmentData.find(
                        (item) => item._id === booking.equipmentId
                    );

                    return {
                        ...booking,
                        equipmentName: equipment?.name || "Equipment not found",
                    };
                });

                setBookings(bookingItems);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load bookings"
                );
            } finally {
                setLoading(false);
            }
        }

        loadBookings();
    }, []);

    // Cancel booking
    async function handleCancel(bookingId: string) {
        try {
            setCancellingId(bookingId);

            await cancelBooking(bookingId);

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status: "cancelled" }
                        : booking
                )
            );

            toast.add({
                title: "Success",
                description: "Booking cancelled successfully.",
                type: "success",
            });

            setSelectedBooking("");
        } catch (error) {
            toast.add({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to cancel booking.",
                type: "error",
            });
        } finally {
            setCancellingId("");
        }
    }

    // Filter bookings
    const filteredBookings = bookings.filter((booking) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            booking.equipmentName.toLowerCase().includes(searchText) ||
            booking._id.toLowerCase().includes(searchText);

        let matchesTab = true;

        if (activeTab === "upcoming") {
            matchesTab =
                booking.status === "pending" ||
                booking.status === "approved";
        }

        if (activeTab === "completed") {
            matchesTab = booking.status === "completed";
        }

        if (activeTab === "cancelled") {
            matchesTab =
                booking.status === "cancelled" ||
                booking.status === "rejected";
        }

        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-w-0 space-y-6">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-bold">My bookings</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    View and manage all your equipment bookings.
                </p>
            </div>

            {/* Search and Tabs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`rounded-full border px-4 py-2 text-sm ${
                                activeTab === tab.value
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:bg-muted"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Booking Table */}
            <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-muted/40 text-xs text-muted-foreground">
                            <tr>
                                <th className="px-4 py-4">ID</th>
                                <th className="px-4 py-4">Equipment</th>
                                <th className="px-4 py-4">Dates</th>
                                <th className="px-4 py-4">Total</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center">
                                        Loading bookings...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-red-400"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {
                                    const status = getStatus(booking.status);

                                    return (
                                        <tr
                                            key={booking._id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-5">
                                                BK-{booking._id.slice(-4).toUpperCase()}
                                            </td>

                                            <td className="px-4 py-5">
                                                {booking.equipmentName}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-5">
                                                {formatDate(
                                                    booking.startDate,
                                                    booking.endDate
                                                )}
                                            </td>

                                            <td className="px-4 py-5 font-semibold">
                                                ${booking.totalPrice.toLocaleString()}
                                            </td>

                                            <td className="px-4 py-5">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${status.color}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>

                                            <td className="px-4 py-5">
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/customer/bookings/${booking._id}`
                                                            )
                                                        }
                                                        className="rounded-lg border border-border px-3 py-2 text-xs"
                                                    >
                                                        View
                                                    </button>

                                                    {(booking.status === "pending" ||
                                                        booking.status === "approved") && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                cancellingId === booking._id
                                                            }
                                                            onClick={() =>
                                                                setSelectedBooking(
                                                                    booking._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-transparent px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {cancellingId === booking._id
                                                                ? "Cancelling..."
                                                                : "Cancel"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Count */}
            {!loading && !error && (
                <p className="text-sm text-muted-foreground">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog
                open={!!selectedBooking}
                onOpenChange={(open) => {
                    if (!open && !cancellingId) {
                        setSelectedBooking("");
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel booking?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to cancel this booking?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!cancellingId}>
                            Keep booking
                        </AlertDialogCancel>

                        <button
                            type="button"
                            disabled={!!cancellingId}
                            onClick={() => handleCancel(selectedBooking)}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {cancellingId ? "Cancelling..." : "Yes, cancel"}
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

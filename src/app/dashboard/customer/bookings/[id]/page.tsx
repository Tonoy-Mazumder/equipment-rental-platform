
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";
import BookingActions from "@/components/booking-actions";
import { getBookingById } from "@/lib/api/booking";
import { getEquipment, type Equipment } from "@/lib/api/equipment";

import {
    CalendarDays,
    MapPin,
    Clock,
    CheckCircle2,
    CreditCard,
    Package,
    Phone,
    MapPinned,
    MessageSquare,
} from "lucide-react";

type BookingData = Awaited<ReturnType<typeof getBookingById>>;

export default function CustomerBookingPage() {
    const { id } = useParams<{ id: string }>();

    const [booking, setBooking] = useState<BookingData | null>(null);
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchBooking() {
            try {
                setLoading(true);
                setError("");

                const data = await getBookingById(id);

                if (!isMounted) return;

                setBooking(data);

                // Equipment fetch is separate so booking still displays
                try {
                    const equipmentList = await getEquipment();

                    const matchedEquipment = equipmentList.find(
                        (item) => item._id === data.equipmentId,
                    );

                    if (isMounted) {
                        setEquipment(matchedEquipment ?? null);
                    }
                } catch (equipmentError) {
                    console.error("Equipment fetch failed:", equipmentError);
                }
            } catch (error) {
                if (isMounted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch booking",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchBooking();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <Loading label="Loading booking details..." />;
    }

    if (error || !booking) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-center text-red-500">
                    {error || "Booking not found"}
                </p>
            </div>
        );
    }

    const statusColor =
        booking.status === "approved"
            ? "bg-green-500/15 text-green-400"
            : booking.status === "cancelled" ||
                booking.status === "rejected"
                ? "bg-red-500/15 text-red-400"
                : booking.status === "completed"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-yellow-500/15 text-yellow-400";

    const rentalDays = Math.max(
        1,
        Math.ceil(
            (new Date(booking.endDate).getTime() -
                new Date(booking.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1,
    );

    const quantity = booking.quantity || 1;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        });

    const formatShortDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
        });

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div>
                <p className="text-sm text-muted-foreground">
                    Dashboard / My Bookings / Details
                </p>

                <h1 className="mt-2 text-2xl font-bold">
                    Booking Details
                </h1>
            </div>

            {/* Booking Information */}
            <div className="rounded-xl border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Booking #{booking._id.slice(-4).toUpperCase()}
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            {equipment?.name ?? "Equipment details unavailable"}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                {formatShortDate(booking.startDate)} -{" "}
                                {formatShortDate(booking.endDate)}
                            </span>

                            <span className="flex items-center gap-2">
                                <MapPin size={16} />
                                {equipment?.location ?? "Location unavailable"}
                            </span>
                        </div>
                    </div>

                    <span
                        className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold capitalize ${statusColor}`}
                    >
                        {booking.status}
                    </span>
                </div>

                <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Booking ID
                        </p>
                        <p className="mt-1 break-all text-sm font-medium">
                            {booking._id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Equipment ID
                        </p>
                        <p className="mt-1 break-all text-sm font-medium">
                            {booking.equipmentId}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rental Information */}
            <div className="rounded-xl border bg-card p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Package size={19} />
                    Rental Information
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Equipment Quantity
                        </p>
                        <p className="mt-1 font-semibold">
                            {quantity} {quantity === 1 ? "unit" : "units"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Rental Duration
                        </p>
                        <p className="mt-1 font-semibold">
                            {rentalDays} days
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Start Date
                        </p>
                        <p className="mt-1 font-semibold">
                            {formatDate(booking.startDate)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            End Date
                        </p>
                        <p className="mt-1 font-semibold">
                            {formatDate(booking.endDate)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Customer Contact Information */}
            <div className="rounded-xl border bg-card p-5 sm:p-6">
                <h2 className="text-lg font-bold">
                    Customer Contact Information
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone size={16} />
                            Phone Number
                        </p>
                        <p className="mt-1 font-medium">
                            {booking.phone || "Not provided"}
                        </p>
                    </div>

                    <div>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPinned size={16} />
                            Address
                        </p>
                        <p className="mt-1 font-medium">
                            {booking.address || "Not provided"}
                        </p>
                    </div>
                </div>

                <div className="mt-5 border-t pt-5">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare size={16} />
                        Additional Notes
                    </p>
                    <p className="mt-2 text-sm">
                        {booking.notes || "No additional notes."}
                    </p>
                </div>
            </div>

            {/* Timeline and Payment */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Timeline */}
                <div className="rounded-xl border bg-card p-5 sm:p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <Clock size={19} />
                        Timeline
                    </h2>

                    <div className="mt-6 space-y-6">
                        <div className="flex gap-3">
                            <CheckCircle2 className="shrink-0 text-green-400" />
                            <div>
                                <p className="text-sm font-medium">
                                    Booking requested
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDate(booking.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CheckCircle2
                                className={`shrink-0 ${
                                    booking.status === "approved"
                                        ? "text-green-400"
                                        : "text-muted-foreground"
                                }`}
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    Owner confirmation
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {booking.status === "approved"
                                        ? "Confirmed"
                                        : booking.status === "rejected"
                                            ? "Rejected"
                                            : booking.status === "cancelled"
                                                ? "Booking cancelled"
                                                : "Waiting for owner"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CreditCard
                                className={`shrink-0 ${
                                    booking.paymentStatus === "paid"
                                        ? "text-green-400"
                                        : "text-muted-foreground"
                                }`}
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    Payment
                                </p>
                                <p className="text-xs capitalize text-muted-foreground">
                                    {booking.paymentStatus || "Not available"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CalendarDays className="shrink-0 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Rental start
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDate(booking.startDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-xl border bg-card p-5 sm:p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <CreditCard size={19} />
                        Payment Summary
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                                Rental duration
                            </span>
                            <span className="font-medium">
                                {rentalDays} days
                            </span>
                        </div>

                        <div className="flex justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                                Equipment quantity
                            </span>
                            <span className="font-medium">
                                {quantity}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                                Payment status
                            </span>
                            <span
                                className={
                                    booking.paymentStatus === "paid"
                                        ? "font-semibold text-green-400"
                                        : "font-medium"
                                }
                            >
                                {booking.paymentStatus || "Unavailable"}
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-base font-bold">
                                <span>Total Amount</span>
                                <span>
                                    ${booking.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Actions */}
            <BookingActions
                bookingId={booking._id}
                status={booking.status}
            />
        </div>
    );
}

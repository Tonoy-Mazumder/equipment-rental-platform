
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { useParams } from "next/navigation";

import BookingActions from "@/components/booking-actions";
import { getBookingById } from "@/lib/api/booking";

import {
    CalendarDays,
    MapPin,
    Clock,
    CheckCircle2,
    CreditCard,
} from "lucide-react";
import { getEquipment, type Equipment } from "@/lib/api/equipment";
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
                const equipmentList = await getEquipment();

                const matchedEquipment = equipmentList.find(
                    (item) => item._id === data.equipmentId,
                );

                if (isMounted) {
                    setBooking(data);
                    setEquipment(matchedEquipment ?? null);
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
        ),
    );

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
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
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
                            <Clock className="shrink-0 text-muted-foreground" />

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
                            <Clock className="shrink-0 text-muted-foreground" />

                            <div>
                                <p className="text-sm font-medium">Payment</p>

                                <p className="text-xs text-muted-foreground">
                                    Payment information unavailable
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CalendarDays className="shrink-0 text-muted-foreground" />

                            <div>
                                <p className="text-sm font-medium">Rental start</p>

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
                                {rentalDays} days rental
                            </span>

                            <span className="font-medium">
                                ${booking.totalPrice.toLocaleString()}
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-base font-bold">
                                <span>Total Amount</span>

                                <span>
                                    ${booking.totalPrice.toLocaleString()}
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Payment status is not available yet.
                            </p>
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

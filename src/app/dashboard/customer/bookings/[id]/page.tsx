
import BookingActions from "@/components/booking-actions";
import { getBookingById } from "@/lib/api/booking";


import {
    CalendarDays,
    MapPin,
    Clock,
    CheckCircle2,
    CreditCard,
} from "lucide-react";

const CustomerBookingPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const booking = await getBookingById(id);

    const statusColor =
        booking.status === "approved"
            ? "bg-green-100 text-green-700"
            : booking.status === "cancelled" ||
                booking.status === "rejected"
                ? "bg-red-100 text-red-700"
                : booking.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700";

    const rentalDays = Math.max(
        1,
        Math.ceil(
            (new Date(booking.endDate).getTime() -
                new Date(booking.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
        )
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
                            Equipment Rental
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                {formatShortDate(booking.startDate)} -{" "}
                                {formatShortDate(booking.endDate)}
                            </span>

                            <span className="flex items-center gap-2">
                                <MapPin size={16} />
                                Equipment location
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
                            <CheckCircle2 className="shrink-0 text-green-600" />

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
                                <p className="text-sm font-medium">
                                    Payment
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Payment information unavailable
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
};

export default CustomerBookingPage;

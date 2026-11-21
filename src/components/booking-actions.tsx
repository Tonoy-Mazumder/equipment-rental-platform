
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, XCircle } from "lucide-react";

import { cancelBooking } from "@/lib/api/booking";
import { toast } from "@/components/ui/toast";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BookingActionsProps = {
    bookingId: string;
    status: string;
};

const BookingActions = ({
    bookingId,
    status,
}: BookingActionsProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleCancel = async () => {
        try {
            setLoading(true);

            await cancelBooking(bookingId);

            toast.add({
                title: "Success",
                description: "Booking cancelled successfully.",
                type: "success",
            });

            setOpen(false);
            router.refresh();
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
            setLoading(false);
        }
    };

    const isDisabled =
        status === "cancelled" || status === "completed";

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground opacity-50 sm:flex-1"
                >
                    <MessageCircle size={17} />
                    Message Owner
                </button>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    disabled={isDisabled}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                >
                    <XCircle size={17} />
                    Cancel Booking
                </button>
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel this booking?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to cancel this booking?
                            This action will update your booking status.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                            Keep Booking
                        </AlertDialogCancel>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Cancelling..." : "Yes, Cancel"}
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default BookingActions;

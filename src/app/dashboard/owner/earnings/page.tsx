
"use client";

import { useEffect, useState } from "react";
import {
    DollarSign,
    TrendingUp,
    Clock,
    XCircle,
    CalendarDays,
    Receipt,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
    getOwnerEarnings,
    type EarningsData,
} from "@/lib/api/earnings";
import { toast } from "@/components/ui/toast";

const pageWrapper =
    "dark -m-5 min-h-full bg-background p-5 text-foreground md:-m-8 md:p-8";

export default function OwnerEarningsPage() {
    const { data: session, isPending } = authClient.useSession();

    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ownerId = session?.user?.id;

        if (!ownerId) {
            if (!isPending) setLoading(false);
            return;
        }

        async function loadEarnings(id: string) {
            try {
                const data = await getOwnerEarnings(id);
                setEarnings(data);
            } catch (error) {
                toast.add({
                    title: "Error",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Failed to load earnings",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        }

        loadEarnings(ownerId);
    }, [session?.user?.id, isPending]);

    if (isPending || loading) {
        return (
            <div className={pageWrapper}>
                <p>Loading earnings...</p>
            </div>
        );
    }

    if (!earnings) {
        return (
            <div className={pageWrapper}>
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">
                        Unable to load earnings data.
                    </p>
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Earnings",
            value: earnings.totalEarnings,
            description: "From completed rentals",
            icon: DollarSign,
        },
        {
            title: "This Month",
            value: earnings.thisMonthEarnings,
            description: "Completed rental earnings",
            icon: TrendingUp,
        },
        {
            title: "Pending Earnings",
            value: earnings.pendingEarnings,
            description: "Approved bookings",
            icon: Clock,
        },
        {
            title: "Cancelled Amount",
            value: earnings.cancelledAmount,
            description: "From cancelled bookings",
            icon: XCircle,
        },
    ];

    const maxEarning = Math.max(
        ...earnings.monthlyEarnings.map((item) => item.earnings),
        1
    );

    return (
        <div className={pageWrapper}>
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Heading */}
                <div>
                    <p className="text-sm font-semibold text-brand">
                        FINANCIAL OVERVIEW
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">
                        Earnings
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Track your rental income and transactions.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="rounded-2xl border border-border bg-card p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <div className="rounded-xl bg-brand/10 p-3 text-brand">
                                        <Icon size={21} />
                                    </div>
                                </div>

                                <h2 className="mt-5 text-2xl font-bold">
                                    ${card.value.toLocaleString()}
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Monthly Earnings Chart */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-brand/10 p-3 text-brand">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                Monthly Earnings
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Earnings from completed rentals this year
                            </p>
                        </div>
                    </div>

                    <div className="flex h-64 items-end gap-2 border-b border-border pb-2 sm:gap-4">
                        {earnings.monthlyEarnings.map((item) => (
                            <div
                                key={item.month}
                                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                            >
                                <span className="hidden text-[10px] text-muted-foreground sm:block">
                                    {item.earnings > 0
                                        ? `$${item.earnings}`
                                        : ""}
                                </span>

                                <div className="flex h-full w-full items-end">
                                    <div
                                        className="w-full rounded-t-md bg-brand transition-all"
                                        style={{
                                            height: `${
                                                item.earnings > 0
                                                    ? Math.max(
                                                          (item.earnings /
                                                              maxEarning) *
                                                              100,
                                                          3
                                                      )
                                                    : 0
                                            }%`,
                                        }}
                                    />
                                </div>

                                <span className="text-[10px] text-muted-foreground sm:text-xs">
                                    {item.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rental Summary */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                        <div className="rounded-xl bg-brand/10 p-3 text-brand">
                            <CalendarDays size={23} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completed Rentals
                            </p>
                            <h3 className="mt-1 text-2xl font-bold">
                                {earnings.completedRentals}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                        <div className="rounded-xl bg-brand/10 p-3 text-brand">
                            <Receipt size={23} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completed Transactions
                            </p>
                            <h3 className="mt-1 text-2xl font-bold">
                                {earnings.transactions}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="border-b border-border p-5">
                        <h2 className="text-lg font-bold">
                            Recent Bookings
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your latest rental bookings.
                        </p>
                    </div>

                    {earnings.recentTransactions.length === 0 ? (
                        <div className="p-10 text-center">
                            <Receipt
                                size={35}
                                className="mx-auto text-muted-foreground"
                            />
                            <p className="mt-3 font-semibold">
                                No bookings yet
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your rental bookings will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4">Booking ID</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earnings.recentTransactions.map(
                                        (transaction) => (
                                            <tr
                                                key={transaction._id}
                                                className="border-t border-border"
                                            >
                                                <td className="p-4 font-medium">
                                                    #{transaction._id.slice(-8)}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-semibold">
                                                    ${transaction.totalPrice}
                                                </td>
                                                <td className="p-4">
                                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

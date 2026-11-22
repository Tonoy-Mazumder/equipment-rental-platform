
import { authClient } from "../auth-client";
import { API_BASE_URL } from "./config";

export type EarningsData = {
    totalEarnings: number;
    thisMonthEarnings: number;
    pendingEarnings: number;
    cancelledAmount: number;
    completedRentals: number;
    transactions: number;
    monthlyEarnings: {
        month: string;
        earnings: number;
    }[];
    recentTransactions: {
        _id: string;
        equipmentName?: string;
        totalPrice: number;
        status: string;
        createdAt: string;
    }[];
};





export async function getOwnerEarnings() {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error("Authentication required. Please login again.");
    }

    const response = await fetch(`${API_BASE_URL}/earnings/owner`, {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch earnings");
    }

    return result.data as EarningsData;
}

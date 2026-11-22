import { API_BASE_URL } from "./config";

export type AdminUser = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "owner" | "customer";
    image?: string;
    createdAt: string;
};

export async function getAdminUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/users`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users");
    }

    return result.data as AdminUser[];
}

// get all Equipment for admin
export type AdminEquipment = {
    _id: string;
    ownerId: string;
    name: string;
    category: string;
    description: string;
    pricePerDay: number;
    location: string;
    images: string[];
    status: string;
    createdAt: string;
};

export async function getAdminEquipment() {
    const response = await fetch(
        `${API_BASE_URL}/admin/equipment`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch equipment"
        );
    }

    return result.data as AdminEquipment[];
}

// get admin rentals
export type AdminRental = {
    _id: string;
    equipmentId: string;
    customerId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    ownerName: string;
    ownerEmail: string;
    equipmentName: string;
};

export async function getAdminRentals() {
    const response = await fetch(`${API_BASE_URL}/admin/rentals`);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to fetch rentals");
    }

    return result.data as AdminRental[];
}

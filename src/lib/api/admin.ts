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
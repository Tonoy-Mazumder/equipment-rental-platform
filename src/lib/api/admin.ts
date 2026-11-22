import { API_BASE_URL } from "./config";
import { authClient } from "@/lib/auth-client";

// Get JWT token
async function getAuthHeaders() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
  };
}

// Admin Analytics
export type AdminAnalytics = {
  users: {
    total: number;
    customers: number;
    owners: number;
    admins: number;
  };
  equipment: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  rentals: {
    total: number;
    pending: number;
    approved: number;
    cancelled: number;
  };
  totalRevenue: number;
};

export async function getAdminAnalytics() {
  const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch analytics");
  }

  return result.data as AdminAnalytics;
}

// Admin Users
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "customer";
  image?: string;
  createdAt: string;
};

export async function getAdminUsers() {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: await getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.data as AdminUser[];
}

// Admin Equipment
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
  approvalStatus: "pending" | "approved" | "rejected";
};

export async function getAdminEquipment() {
  const response = await fetch(`${API_BASE_URL}/admin/equipment`, {
    headers: await getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch equipment");
  }

  return result.data as AdminEquipment[];
}

// Admin Rentals
export type AdminRental = {
  _id: string;
  equipmentId: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: "paid" | "unpaid" | "failed";
  createdAt: string;
  customerName: string;
  customerEmail: string;
  ownerName: string;
  ownerEmail: string;
  equipmentName: string;
};

export async function getAdminRentals() {
  const response = await fetch(`${API_BASE_URL}/admin/rentals`, {
    headers: await getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch rentals");
  }

  return result.data as AdminRental[];
}

// Update User Role
export async function updateAdminUserRole(
  userId: string,
  role: "customer" | "owner",
) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ role }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user role");
  }

  return result;
}

// Update Equipment Approval
export async function updateEquipmentApproval(
  equipmentId: string,
  approvalStatus: "approved" | "rejected",
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/equipment/${equipmentId}/approval`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ approvalStatus }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment");
  }

  return result;
}

export async function updateAdminEquipment(
  equipmentId: string,
  equipmentData: {
    name: string;
    category: string;
    description: string;
    pricePerDay: number;
    location: string;
    images: string[];
  },
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/equipment/${equipmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify(equipmentData),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment");
  }

  return result;
}

// Delete Equipment
export async function deleteAdminEquipment(equipmentId: string) {
  const response = await fetch(
    `${API_BASE_URL}/admin/equipment/${equipmentId}`,
    {
      method: "DELETE",
      headers: await getAuthHeaders(),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete equipment");
  }

  return result;
}

// Update rental booking status by admin
export const updateAdminRentalStatus = async (
  rentalId: string,
  status: string
) => {
  const { data: tokenData } = await authClient.token();

  const response = await fetch(
    `${API_BASE_URL}/admin/rentals/${rentalId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update rental status");
  }

  return result;
};
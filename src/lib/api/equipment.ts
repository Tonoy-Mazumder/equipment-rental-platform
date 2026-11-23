import { API_BASE_URL } from "./config";
import { authClient } from "@/lib/auth-client";
export type Equipment = {
  _id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  images: string[];
  status: "available" | "rented";
  createdAt: string;
};

type EquipmentListResponse = {
  success: boolean;
  data: Equipment[];
};

type SingleEquipmentResponse = {
  success: boolean;
  data: Equipment;
};

// Get all equipment

export type EquipmentFilters = {
  search?: string;
  category?: string[];
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "available" | "rented";
};

export async function getEquipment(
  filters: EquipmentFilters = {},
): Promise<Equipment[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      params.append(key, item);
    });
  } else if (value !== undefined && value !== "") {
    params.append(key, String(value));
  }
});

  const response = await fetch(
    `${API_BASE_URL}/equipment?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  const result: EquipmentListResponse = await response.json();

  return result.data;
}

// Get single equipment by ID
export async function getEquipmentById(id: string): Promise<Equipment> {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch equipment details");
  }

  const result: SingleEquipmentResponse = await response.json();

  return result.data;
}

type AddEquipmentData = {
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  images: string[];
};

// add new eqipment
export async function addEquipment(data: AddEquipmentData) {
  const { data: tokenData, error } = await authClient.token();

  if (error || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/equipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add equipment.");
  }

  return result;
}

export async function getOwnerEquipment(): Promise<Equipment[]> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/equipment/owner`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch owner equipment");
  }

  const result: EquipmentListResponse = await response.json();

  return result.data;
}

// update equipment

export async function updateEquipment(
  id: string,
  equipmentData: {
    name: string;
    category: string;
    description: string;
    pricePerDay: number;
    location: string;
    images: string[];
  },
) {
  const { data: tokenData, error } = await authClient.token();

  if (error || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify(equipmentData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment");
  }

  return result;
}

// Delete equipment

export async function deleteEquipment(id: string) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete equipment");
  }

  return result;
}

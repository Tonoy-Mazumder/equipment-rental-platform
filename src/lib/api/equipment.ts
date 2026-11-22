
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
export async function getEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE_URL}/equipment`);

  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  const result: EquipmentListResponse = await response.json();

  return result.data;
}

// Get single equipment by ID
export async function getEquipmentById(
  id: string
): Promise<Equipment> {
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


export async function getOwnerEquipment(
  ownerId: string
): Promise<Equipment[]> {
  const response = await fetch(
    `${API_BASE_URL}/equipment/owner/${ownerId}`
  );

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
        ownerId: string;
        name: string;
        category: string;
        description: string;
        pricePerDay: number;
        location: string;
        images: string[];
    }
) {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
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
export async function deleteEquipment(
    id: string,
    ownerId: string
) {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerId }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to delete equipment");
    }

    return result;
}

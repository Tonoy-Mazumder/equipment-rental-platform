
import { API_BASE_URL } from "./config";

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

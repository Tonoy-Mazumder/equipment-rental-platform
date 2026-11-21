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

type EquipmentResponse = {
  success: boolean;
  data: Equipment[];
};

export async function getEquipment(): Promise<Equipment[]> {
  const response = await fetch(`${API_BASE_URL}/equipment`);

  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }

  const result: EquipmentResponse = await response.json();

  return result.data;
}
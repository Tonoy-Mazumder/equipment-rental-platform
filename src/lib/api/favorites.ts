import { API_BASE_URL } from "./config";
import { authClient } from "@/lib/auth-client";

export async function addFavorite(equipmentId: string) {
  const { data: tokenData, error } = await authClient.token();

  if (error || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify({ equipmentId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add favorite");
  }

  return result;
}

export async function getFavorites() {
  const { data: tokenData, error } = await authClient.token();

  if (error || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch favorites");
  }

  return result.data;
}

import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createCheckoutSession(data: {
  equipmentId: string;
  startDate: string;
  endDate: string;
}) {
  const { data: tokenData, error } = await authClient.token();

  if (error || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const response = await fetch(
    `${API_BASE_URL}/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create checkout session");
  }

  return result.checkoutUrl as string;
}

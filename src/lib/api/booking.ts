import { API_BASE_URL } from "./config";


type CreateBookingData = {
  equipmentId: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
};

export async function createBooking(data: CreateBookingData) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create booking");
  }

  return result;
}
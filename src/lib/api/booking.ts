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

// Booking data type
export type Booking = {
  _id: string;
  equipmentId: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  createdAt: string;
};

// Get all bookings for a specific customer
export async function getCustomerBookings(
  customerId: string,
): Promise<Booking[]> {
  // Fetch customer bookings from backend
  const response = await fetch(
    `${API_BASE_URL}/bookings/customer/${customerId}`,
  );

  // Check for API errors
  if (!response.ok) {
    throw new Error("Failed to fetch customer bookings");
  }

  // Convert response into JSON
  const result: {
    success: boolean;
    data: Booking[];
  } = await response.json();

  // Return booking list
  return result.data;
}

// Cancel a booking
export async function cancelBooking(bookingId: string) {
  // Send PATCH request to backend
  const response = await fetch(
    `${API_BASE_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
    }
  );

  // Convert response into JSON
  const result = await response.json();

  // Check for API errors
  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel booking");
  }

  // Return API response
  return result;
}
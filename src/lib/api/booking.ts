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
  customerName?: string;
  customerEmail?: string;
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
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });

  // Convert response into JSON
  const result = await response.json();

  // Check for API errors
  if (!response.ok) {
    throw new Error(result.message || "Failed to cancel booking");
  }

  // Return API response
  return result;
}
// Get single booking by ID
export async function getBookingById(bookingId: string): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);

  const result: {
    success: boolean;
    data: Booking;
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch booking");
  }

  return result.data;
}

// Get all bookings for an owner
export async function getOwnerBookings(ownerId: string): Promise<Booking[]> {
  const response = await fetch(`${API_BASE_URL}/bookings/owner/${ownerId}`);

  const result: {
    success: boolean;
    data: Booking[];
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch owner bookings");
  }

  return result.data;
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: "approved" | "rejected",
) {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update booking");
  }

  return result;
}

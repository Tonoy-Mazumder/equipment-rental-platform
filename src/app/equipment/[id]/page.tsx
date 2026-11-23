
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  HardHat,
  MapPin,
  Truck,
  Heart,
} from "lucide-react";

import { createCheckoutSession } from "@/lib/api/payment";
import {
  getEquipmentById,
  type Equipment,
} from "@/lib/api/equipment";
import {
  addFavorite,
  getFavorites,
} from "@/lib/api/favorites";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Loading } from "@/components/loading";

const SERVICE_FEE_PERCENT = 5;

function ImageBox({
  icon: Icon,
  image,
  className = "",
}: {
  icon: typeof HardHat;
  image?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#b8742a] to-[#2a1a08] ${className}`}
    >
      {image ? (
        <img
          src={image}
          alt="Equipment"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Icon
          className="size-14 text-white/90"
          strokeWidth={1.5}
        />
      )}
    </div>
  );
}

// Booking Form
function BookingBox({
  pricePerDay,
  quantity: availableQuantity,
  available,
  equipmentId,
  ownerId,
  customerId,
}: {
  pricePerDay: number;
  quantity: number;
  available: boolean;
  equipmentId: string;
  ownerId: string;
  customerId: string;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const selectedQuantity = Number(quantity);

  const days =
    startDate && endDate && endDate >= startDate
      ? Math.floor(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

  const rentalPrice =
    days * pricePerDay * selectedQuantity;

  const serviceFee = Math.round(
    (rentalPrice * SERVICE_FEE_PERCENT) / 100,
  );

  const total = rentalPrice + serviceFee;

  async function handleBooking() {
    setBookingMessage("");

    if (!customerId) {
      setBookingMessage("Please login to book equipment.");
      return;
    }

    if (!startDate || !endDate || days <= 0) {
      setBookingMessage("Please select valid rental dates.");
      return;
    }

    if (startDate < minDate) {
      setBookingMessage("Past dates cannot be selected.");
      return;
    }

    if (
      !Number.isInteger(selectedQuantity) ||
      selectedQuantity < 1 ||
      selectedQuantity > availableQuantity
    ) {
      setBookingMessage(
        `Quantity must be between 1 and ${availableQuantity}.`,
      );
      return;
    }

    if (!phone.trim() || !address.trim()) {
      setBookingMessage("Phone and address are required.");
      return;
    }

    if (!ownerId || customerId === ownerId) {
      setBookingMessage("You cannot book your own equipment.");
      return;
    }

    try {
      setBookingLoading(true);

      const checkoutUrl = await createCheckoutSession({
        equipmentId,
        startDate,
        endDate,
        quantity: selectedQuantity,
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });

      window.location.href = checkoutUrl;
    } catch (error) {
      setBookingMessage(
        error instanceof Error
          ? error.message
          : "Failed to start checkout.",
      );

      setBookingLoading(false);
    }
  }

  return (
    <aside className="h-fit rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5 text-white">
      {/* Price */}
      <p>
        <span className="text-2xl font-extrabold">
          ${pricePerDay}
        </span>

        <span className="ml-1 text-sm text-[#9a9c96]">
          /day
        </span>
      </p>

      <div className="mt-5 space-y-4">
        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            min={minDate}
            value={startDate}
            onChange={(event) => {
              const value = event.target.value;

              setStartDate(value);

              if (endDate && value > endDate) {
                setEndDate("");
              }

              setBookingMessage("");
            }}
            className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white"
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="endDate"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            End Date
          </label>

          <input
            id="endDate"
            type="date"
            min={startDate || minDate}
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              setBookingMessage("");
            }}
            className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            Quantity (Available: {availableQuantity})
          </label>

          <input
            id="quantity"
            type="number"
            min="1"
            max={availableQuantity}
            step="1"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setBookingMessage("");
            }}
            className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            Phone Number
          </label>

          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone number"
            className="mt-1 w-full rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white placeholder:text-[#777]"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            Delivery Address
          </label>

          <textarea
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter your full address"
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white placeholder:text-[#777]"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="text-xs font-semibold text-[#9a9c96]"
          >
            Additional Notes (Optional)
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Any special instructions?"
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm text-white placeholder:text-[#777]"
          />
        </div>
      </div>

      {/* Price Calculation */}
      <div className="mt-5 space-y-2 text-sm text-[#9a9c96]">
        <div className="flex justify-between gap-2">
          <span>
            {days} days × {selectedQuantity} × ${pricePerDay}
          </span>

          <span>${rentalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Service fee (5%)</span>
          <span>${serviceFee}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-[#2f3639] pt-4 font-bold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      {/* Booking Button */}
      <button
        type="button"
        onClick={handleBooking}
        disabled={
          !available ||
          bookingLoading ||
          days <= 0 ||
          !Number.isInteger(selectedQuantity) ||
          selectedQuantity < 1 ||
          selectedQuantity > availableQuantity
        }
        className="mt-4 w-full rounded-lg bg-[#F28C28] py-2.5 text-sm font-semibold text-[#111719] hover:bg-[#e07d1a] disabled:opacity-50"
      >
        {bookingLoading
          ? "Redirecting to payment..."
          : available
            ? "Book now"
            : "Not available"}
      </button>

      {bookingMessage && (
        <p className="mt-3 text-center text-sm text-[#F28C28]">
          {bookingMessage}
        </p>
      )}
    </aside>
  );
}

// Equipment Details Page
export default function EquipmentDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: session } = authClient.useSession();

  const customerId = session?.user?.id || "";
  const isCustomer = session?.user?.role === "customer";

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load equipment details
  useEffect(() => {
    async function loadEquipment() {
      try {
        setLoading(true);
        setError("");

        const data = await getEquipmentById(id);
        setEquipment(data);
      } catch {
        setError("Failed to load equipment details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEquipment();
    }
  }, [id]);

  // Check whether equipment is already in favorites
  useEffect(() => {
    if (!isCustomer || !customerId || !id) {
      setIsFavorite(false);
      return;
    }

    async function checkFavorite() {
      try {
        const favorites = await getFavorites();

        const alreadyFavorite = favorites.some(
          (favorite: { equipmentId: string }) =>
            favorite.equipmentId === id,
        );

        setIsFavorite(alreadyFavorite);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      }
    }

    checkFavorite();
  }, [isCustomer, customerId, id]);

  // Add equipment to favorites
  async function handleAddFavorite() {
    if (!customerId) {
      toast.add({
        title: "Login required",
        description: "Please login to add favorites.",
        type: "warning",
      });

      return;
    }

    if (isFavorite) return;

    try {
      setFavoriteLoading(true);

      await addFavorite(id);

      setIsFavorite(true);

      toast.add({
        title: "Success",
        description: "Equipment added to favorites.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add favorite",
        type: "error",
      });
    } finally {
      setFavoriteLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#111719] text-white">
        <Loading
          className="min-h-screen"
          label="Loading equipment details..."
        />
      </main>
    );
  }

  // Error state
  if (error || !equipment) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111719] text-white">
        <p className="text-red-400">
          {error || "Equipment not found."}
        </p>

        <Link
          href="/equipment"
          className="rounded-lg bg-[#F28C28] px-5 py-2 text-sm font-semibold text-[#111719]"
        >
          Back to browse
        </Link>
      </main>
    );
  }

  const available = equipment.status === "available";
  const images = equipment.images ?? [];

  return (
    <main className="min-h-screen bg-[#111719] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#9a9c96]">
          <Link
            href="/equipment"
            className="hover:text-white"
          >
            Browse
          </Link>

          {" / "}

          <Link
            href={`/equipment?category=${encodeURIComponent(equipment.category)}`}
            className="hover:text-white"
          >
            {equipment.category}
          </Link>

          {" / "}

          {equipment.name}
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {/* Equipment Image Gallery */}
            <div className="grid h-[310px] grid-cols-[2fr_1fr] gap-2.5">
              <ImageBox
                icon={HardHat}
                image={images[0]}
                className="h-full"
              />

              <div className="grid grid-rows-2 gap-2.5">
                <ImageBox
                  icon={HardHat}
                  image={images[1]}
                />

                <ImageBox
                  icon={Truck}
                  image={images[2]}
                />
              </div>
            </div>

            {/* Equipment Name */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {equipment.name}
              </h1>

              {isCustomer && (
                <button
                  type="button"
                  onClick={handleAddFavorite}
                  disabled={favoriteLoading || isFavorite}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#F28C28] px-4 py-2.5 text-sm font-semibold text-[#F28C28] transition-colors hover:bg-[#F28C28] hover:text-[#111719] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Heart
                    className={`size-4 ${
                      isFavorite ? "fill-current" : ""
                    }`}
                  />

                  {favoriteLoading
                    ? "Adding..."
                    : isFavorite
                      ? "Added to Favorites"
                      : "Add to Favorites"}
                </button>
              )}
            </div>

            {/* Equipment Information */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#9a9c96]">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {equipment.location}
              </span>

              <span>·</span>

              <span>{equipment.category}</span>

              <span>·</span>

              {available ? (
                <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                  Available
                </span>
              ) : (
                <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
                  Rented
                </span>
              )}
            </div>

            <p className="mt-4 leading-relaxed text-[#d0d0ca]">
              {equipment.description}
            </p>

            {/* Equipment Details Table */}
            <h2 className="mt-8 text-lg font-bold">
              Equipment Information
            </h2>

            <div className="mt-3 overflow-hidden rounded-2xl border border-[#2f3639]">
              <table className="w-full text-left text-sm">
                <tbody>
                  <tr className="bg-[#1b2124]">
                    <td className="px-4 py-3.5 text-[#9a9c96]">
                      Category
                    </td>

                    <td className="px-4 py-3.5">
                      {equipment.category}
                    </td>
                  </tr>

                  <tr className="border-t border-[#2f3639]">
                    <td className="px-4 py-3.5 text-[#9a9c96]">
                      Location
                    </td>

                    <td className="px-4 py-3.5">
                      {equipment.location}
                    </td>
                  </tr>

                  <tr className="border-t border-[#2f3639]">
                    <td className="px-4 py-3.5 text-[#9a9c96]">
                      Price per day
                    </td>

                    <td className="px-4 py-3.5">
                      ${equipment.pricePerDay}
                    </td>
                  </tr>

                  <tr className="border-t border-[#2f3639]">
                    <td className="px-4 py-3.5 text-[#9a9c96]">
                      Total Quantity
                    </td>

                    <td className="px-4 py-3.5">
                      {equipment.quantity}
                    </td>
                  </tr>

                  <tr className="border-t border-[#2f3639]">
                    <td className="px-4 py-3.5 text-[#9a9c96]">
                      Availability
                    </td>

                    <td className="px-4 py-3.5">
                      {available ? "Available" : "Rented"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Form */}
          <BookingBox
            pricePerDay={equipment.pricePerDay}
            quantity={equipment.quantity}
            available={available}
            equipmentId={equipment._id}
            ownerId={equipment.ownerId}
            customerId={customerId}
          />
        </div>
      </div>
    </main>
  );
}

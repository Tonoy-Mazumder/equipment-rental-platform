
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

const bookedDays = [8, 9, 10, 16, 17];
const daysInMonth = 30;
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

function BookingBox({
  pricePerDay,
  available,
  equipmentId,
  ownerId,
  customerId,
}: {
  pricePerDay: number;
  available: boolean;
  equipmentId: string;
  ownerId: string;
  customerId: string;
}) {
  const [startDay, setStartDay] = useState<number | null>(null);
  const [endDay, setEndDay] = useState<number | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  function handleDayClick(day: number) {
    setBookingMessage("");

    if (startDay === null || endDay !== null) {
      setStartDay(day);
      setEndDay(null);
      return;
    }

    if (day < startDay) {
      setEndDay(startDay);
      setStartDay(day);
    } else {
      setEndDay(day);
    }
  }

  function isSelected(day: number) {
    if (startDay === null) return false;
    if (endDay === null) return day === startDay;

    return day >= startDay && day <= endDay;
  }

  const days =
    startDay !== null && endDay !== null
      ? endDay - startDay + 1
      : 0;

  const rentalPrice = days * pricePerDay;

  const serviceFee = Math.round(
    (rentalPrice * SERVICE_FEE_PERCENT) / 100,
  );

  const total = rentalPrice + serviceFee;

  const allDays = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1,
  );

  async function handleBooking() {
    if (!customerId) {
      setBookingMessage("Please login to book equipment.");
      return;
    }

    if (!startDay || !endDay) {
      setBookingMessage("Please select rental dates.");
      return;
    }

    if (!ownerId || customerId === ownerId) {
      setBookingMessage("You cannot book your own equipment.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage("");

      const checkoutUrl = await createCheckoutSession({
        equipmentId,
        startDate: `2026-11-${String(startDay).padStart(2, "0")}`,
        endDate: `2026-11-${String(endDay).padStart(2, "0")}`,
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
      <p>
        <span className="text-2xl font-extrabold">
          ${pricePerDay}
        </span>
        <span className="ml-1 text-sm text-[#9a9c96]">
          /day
        </span>
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-[#9a9c96]">
            Start
          </p>

          <div className="mt-1 rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm">
            {startDay ? `Nov ${startDay}, 2026` : "Pick a day"}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#9a9c96]">
            End
          </p>

          <div className="mt-1 rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm">
            {endDay ? `Nov ${endDay}, 2026` : "Pick a day"}
          </div>
        </div>
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        November 2026
      </h3>

      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {allDays.map((day) => {
          const isBooked = bookedDays.includes(day);

          let style =
            "bg-[#111719] text-white hover:bg-[#2f3639]";

          if (isBooked) {
            style =
              "bg-red-950/60 text-red-400 line-through cursor-not-allowed";
          } else if (isSelected(day)) {
            style =
              "bg-[#F28C28] text-[#111719] font-semibold";
          }

          return (
            <button
              key={day}
              type="button"
              disabled={isBooked || !available || bookingLoading}
              onClick={() => handleDayClick(day)}
              className={`h-10 rounded-lg text-xs ${style}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-1 text-sm text-[#9a9c96]">
        <div className="flex justify-between">
          <span>
            {days} days × ${pricePerDay}
          </span>
          <span>${rentalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Service fee</span>
          <span>${serviceFee}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-between border-t border-[#2f3639] pt-4 font-bold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button
        type="button"
        onClick={handleBooking}
        disabled={days === 0 || !available || bookingLoading}
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

  if (error || !equipment) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111719] text-white">
        <p className="text-red-400">
          {error || "Equipment not found."}
        </p>

        <Link
          href="/browse-equipment"
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
        <nav className="text-sm text-[#9a9c96]">
          <Link
            href="/browse-equipment"
            className="hover:text-white"
          >
            Browse
          </Link>

          {" / "}

          <Link
            href={`/browse-equipment?category=${encodeURIComponent(equipment.category)}`}
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
                    className={`size-4 ${isFavorite ? "fill-current" : ""
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

          <BookingBox
            pricePerDay={equipment.pricePerDay}
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

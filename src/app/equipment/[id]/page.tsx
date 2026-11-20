"use client"; // needed because we use useState (the calendar changes on click)

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  HardHat,
  Heart,
  MapPin,
  Star,
  Truck,
  Tractor,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1. DATA (later you can load this from your database)                */
/* ------------------------------------------------------------------ */

const machine = {
  name: "CAT 320 Excavator",
  category: "Excavators",
  city: "Gazipur",
  rating: 4.9,
  reviewCount: 86,
  pricePerDay: 185,
  available: true,
  description:
    "Well-maintained 20-tonne excavator with a hydraulic thumb and three buckets. Ideal for trenching, foundations and site clearing. Operator available on request.",
};

// Rows of the specifications table
const specs = [
  { label: "Operating weight", value: "20,100 kg" },
  { label: "Engine power", value: "121 kW" },
  { label: "Bucket capacity", value: "1.0 m³" },
  { label: "Max dig depth", value: "6.7 m" },
  { label: "Year", value: "2021 · 1,840 hrs" },
];

const owner = {
  name: "Imran Hossain",
  initials: "IH",
  info: "Verified owner · 42 rentals · replies in 1h",
};

const reviews = [
  { name: "Rafiq A.", text: "Ran perfectly for our 5-day job." },
  { name: "Nusrat J.", text: "On time delivery, clean machine." },
];

// Days in November 2026 that are already booked (shown red, can't click)
const bookedDays = [8, 9, 10, 16, 17];
const daysInMonth = 30;
const SERVICE_FEE_PERCENT = 5; // 5% of the rental price

// Three small cards at the bottom
const similarEquipment = [
  {
    name: "Komatsu D65 Dozer",
    slug: "komatsu-d65-dozer",
    category: "Dozers",
    city: "Dhaka",
    rating: 4.8,
    price: 240,
    icon: Tractor,
    color: "linear-gradient(135deg, #7a6a1e, #2a2408)",
  },
  {
    name: "Genie Z-45 Boom Lift",
    slug: "genie-z-45-boom-lift",
    category: "Aerial Lifts",
    city: "Sylhet",
    rating: 4.9,
    price: 160,
    icon: Building,
    color: "linear-gradient(135deg, #4a6070, #1c262e)",
  },
  {
    name: "Volvo A30 Dump Truck",
    slug: "volvo-a30-dump-truck",
    category: "Trucks",
    city: "Khulna",
    rating: 4.8,
    price: 210,
    icon: Truck,
    color: "linear-gradient(135deg, #7a3a28, #2a120c)",
  },
];

/* ------------------------------------------------------------------ */
/* 2. SMALL PIECES                                                     */
/* ------------------------------------------------------------------ */

// Shows 5 orange stars
function FiveStars() {
  return (
    <span className="ml-2 inline-flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="size-3.5 fill-[#F28C28] text-[#F28C28]" />
      ))}
    </span>
  );
}

// A colored picture box with an icon in the middle
function ImageBox({
  color,
  icon: Icon,
  className = "",
}: {
  color: string;
  icon: typeof HardHat;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl ${className}`}
      style={{ backgroundImage: color }}
    >
      <Icon className="size-14 text-white/90" strokeWidth={1.5} />
    </div>
  );
}

// One small card in "Similar equipment"
function SimilarCard({ item }: { item: (typeof similarEquipment)[number] }) {
  const Icon = item.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#2f3639] bg-[#1b2124]">
      <div
        className="relative flex h-44 items-center justify-center"
        style={{ backgroundImage: item.color }}
      >
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          {item.category}
        </span>
        <button
          type="button"
          aria-label={`Save ${item.name}`}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-neutral-900"
        >
          <Heart className="size-4" />
        </button>
        <Icon className="size-14 text-white/90" strokeWidth={1.5} />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white">{item.name}</h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-[#9a9c96]">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {item.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-[#F28C28] text-[#F28C28]" />
            {item.rating}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-white">
            <span className="text-xl font-bold">${item.price}</span>
            <span className="ml-1 text-xs text-[#9a9c96]">/day</span>
          </p>
          <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
            Available
          </span>
        </div>

        <Link
          href={`/equipment/${item.slug}`}
          className="mt-4 block rounded-lg bg-[#F28C28] py-2 text-center text-sm font-semibold text-[#111719] hover:bg-[#e07d1a]"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 3. BOOKING BOX (right side)                                         */
/* ------------------------------------------------------------------ */

function BookingBox() {
  // The days the user picked. null means "nothing picked yet".
  const [startDay, setStartDay] = useState<number | null>(24);
  const [endDay, setEndDay] = useState<number | null>(26);

  // Called when the user clicks a day in the calendar.
  function handleDayClick(day: number) {
    // First click (or starting again): set the start day.
    if (startDay === null || endDay !== null) {
      setStartDay(day);
      setEndDay(null);
      return;
    }

    // Second click: if it is before the start, swap them.
    if (day < startDay) {
      setEndDay(startDay);
      setStartDay(day);
    } else {
      setEndDay(day);
    }
  }

  // Is this day inside the chosen range?
  function isSelected(day: number) {
    if (startDay === null) return false;
    if (endDay === null) return day === startDay;
    return day >= startDay && day <= endDay;
  }

  // Price math
  const days = startDay !== null && endDay !== null ? endDay - startDay + 1 : 0;
  const rentalPrice = days * machine.pricePerDay;
  const serviceFee = Math.round((rentalPrice * SERVICE_FEE_PERCENT) / 100);
  const total = rentalPrice + serviceFee;

  // List of numbers: [1, 2, 3, ... 30]
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <aside className="h-fit rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5 text-white">
      <p>
        <span className="text-2xl font-extrabold">${machine.pricePerDay}</span>
        <span className="ml-1 text-sm text-[#9a9c96]">/day</span>
      </p>

      {/* Start and End boxes (they fill in when you click the calendar) */}
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold text-[#9a9c96]">Start</p>
          <div className="mt-1 rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm">
            {startDay ? `Nov ${startDay}, 2026` : "Pick a day"}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#9a9c96]">End</p>
          <div className="mt-1 rounded-lg border border-[#2f3639] bg-[#111719] px-3 py-2.5 text-sm">
            {endDay ? `Nov ${endDay}, 2026` : "Pick a day"}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <h3 className="mt-5 text-sm font-semibold">November 2026</h3>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {allDays.map((day) => {
          const isBooked = bookedDays.includes(day);

          // Pick the color for this day
          let style = "bg-[#111719] text-white hover:bg-[#2f3639]"; // normal
          if (isBooked) {
            style = "bg-red-950/60 text-red-400 line-through cursor-not-allowed";
          } else if (isSelected(day)) {
            style = "bg-[#F28C28] text-[#111719] font-semibold";
          }

          return (
            <button
              key={day}
              type="button"
              disabled={isBooked}
              onClick={() => handleDayClick(day)}
              className={`h-10 rounded-lg text-xs ${style}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Price summary */}
      <div className="mt-5 space-y-1 text-sm text-[#9a9c96]">
        <div className="flex justify-between">
          <span>
            {days} days × ${machine.pricePerDay}
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
        disabled={days === 0}
        className="mt-4 w-full rounded-lg bg-[#F28C28] py-2.5 text-sm font-semibold text-[#111719] hover:bg-[#e07d1a] disabled:opacity-50"
      >
        Book now
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* 4. THE WHOLE PAGE                                                   */
/* ------------------------------------------------------------------ */

export default function EquipmentDetails() {
  return (
    <main className="min-h-screen bg-[#111719] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#9a9c96]">
          <Link href="/equipment" className="hover:text-white">
            Browse
          </Link>{" "}
          /{" "}
          <Link
            href={`/equipment?category=${machine.category.toLowerCase()}`}
            className="hover:text-white"
          >
            {machine.category}
          </Link>{" "}
          / {machine.name}
        </nav>

        {/* Two columns: details on the left, booking box on the right */}
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* ---------- LEFT SIDE ---------- */}
          <div className="min-w-0">
            {/* Photos: 1 big + 2 small */}
            <div className="grid h-[310px] grid-cols-[2fr_1fr] gap-2.5">
              <ImageBox
                color="linear-gradient(135deg, #b8742a, #2a1a08)"
                icon={HardHat}
                className="h-full"
              />
              <div className="grid grid-rows-2 gap-2.5">
                <ImageBox
                  color="linear-gradient(135deg, #8a7a22, #2a2408)"
                  icon={HardHat}
                />
                <ImageBox
                  color="linear-gradient(135deg, #7a3a28, #2a120c)"
                  icon={Truck}
                />
              </div>
            </div>

            {/* Title and info line */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
              {machine.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#9a9c96]">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {machine.city}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-[#F28C28] text-[#F28C28]" />
                {machine.rating} ({machine.reviewCount} reviews)
              </span>
              <span>·</span>
              {machine.available && (
                <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                  Available
                </span>
              )}
            </div>

            <p className="mt-4 leading-relaxed">{machine.description}</p>

            {/* Specifications table */}
            <h2 className="mt-8 text-lg font-bold">Specifications</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#2f3639]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1b2124] text-xs text-[#9a9c96]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">SPEC</th>
                    <th className="px-4 py-3 font-semibold">VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label} className="border-t border-[#2f3639]">
                      <td className="px-4 py-3.5">{spec.label}</td>
                      <td className="px-4 py-3.5">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Owner card */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#252A2D] text-xs font-semibold">
                  {owner.initials}
                </div>
                <div>
                  <p className="font-semibold">{owner.name}</p>
                  <p className="text-xs text-[#9a9c96]">{owner.info}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-[#2f3639] px-3 py-1.5 text-sm font-semibold hover:border-[#F28C28]"
              >
                Message
              </button>
            </div>

            {/* Reviews */}
            <h2 className="mt-8 text-lg font-bold">Reviews</h2>
            <div className="mt-3 space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="flex items-center rounded-2xl border border-[#2f3639] bg-[#1b2124] px-5 py-4 text-sm"
                >
                  {review.name} — {review.text}
                  <FiveStars />
                </div>
              ))}
            </div>
          </div>

          {/* ---------- RIGHT SIDE ---------- */}
          <BookingBox />
        </div>

        {/* Similar equipment */}
        <h2 className="mt-14 text-3xl font-extrabold tracking-tight">
          Similar equipment
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similarEquipment.map((item) => (
            <SimilarCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
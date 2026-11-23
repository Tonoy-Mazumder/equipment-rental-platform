import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | RentPro",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#111719] px-4 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        <p className="text-hero font-extrabold tracking-tight text-[#F28C28]">
          404
        </p>

        <h1 className="mt-4 text-page font-bold">Page not found</h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60 sm:text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or no longer exists.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="w-full rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-semibold text-[#111719] transition hover:bg-[#e07d1a] sm:w-auto"
          >
            Back to home
          </Link>

          <Link
            href="/equipment"
            className="w-full rounded-lg border border-[#2f3639] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b2124] sm:w-auto"
          >
            Browse equipment
          </Link>
        </div>
      </div>
    </main>
  );
}

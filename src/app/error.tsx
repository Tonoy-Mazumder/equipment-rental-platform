"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#111719] px-4 py-16 text-white">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-page font-bold">Something went wrong</h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60 sm:text-base">
          An unexpected error occurred. Please try again, or come back later if
          the problem keeps happening.
        </p>

        {error?.digest ? (
          <p className="mt-3 font-mono text-xs text-white/40">
            Error reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-lg bg-[#F28C28] px-6 py-3 text-sm font-semibold text-[#111719] transition hover:bg-[#e07d1a] sm:w-auto"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="w-full rounded-lg border border-[#2f3639] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b2124] sm:w-auto"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

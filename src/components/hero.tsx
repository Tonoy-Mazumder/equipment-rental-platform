"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck, Star } from "lucide-react";
import { CraneIllustration } from "@/components/crane-illustration";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClassName =
  "mt-1.5 h-11 w-full rounded-lg border border-background/15 bg-background/5 px-3 text-sm text-background outline-none transition-colors placeholder:text-background/40 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/50";

// The native date picker icon follows the browser color scheme, so flip it
// with the hero panel instead of leaving a dark icon on a dark input.
const dateFieldClassName = cn(
  fieldClassName,
  "[color-scheme:dark] dark:[color-scheme:light]"
);

// Search is not connected yet. The form inputs below already have `name`
// attributes, so this is where the real search logic can be added later.
function handleSearch(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  // TODO: read the submitted values and filter equipment, for example:
  // const formData = new FormData(event.currentTarget);
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Only shown on very wide screens so it never overlaps the search card. */}
      <CraneIllustration className="pointer-events-none absolute top-36 right-0 hidden w-[24rem] text-brand min-[1600px]:block 2xl:w-[28rem]" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">
          Trusted by 12,000+ contractors
        </p>

        <h1 className="mt-6 font-heading text-hero leading-[1.05] font-extrabold tracking-tight">
          <span className="block">Rent the right machine.</span>
          <span className="block text-brand">Skip the buying.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">
          Book excavators, lifts, generators and more from verified local owners
          — priced by the day, insured, delivered.
        </p>

        <form
          onSubmit={handleSearch}
          aria-label="Equipment search"
          className="mt-10 max-w-4xl rounded-xl border border-background/10 bg-background/5 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="equipment"
                className="text-sm font-medium text-background/60"
              >
                Equipment
              </label>
              <input
                id="equipment"
                name="equipment"
                type="text"
                placeholder="e.g. excavator"
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-background/60"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="City"
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="from"
                className="text-sm font-medium text-background/60"
              >
                From
              </label>
              <input
                id="from"
                name="from"
                type="date"
                className={dateFieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="to"
                className="text-sm font-medium text-background/60"
              >
                To
              </label>
              <input
                id="to"
                name="to"
                type="date"
                className={dateFieldClassName}
              />
            </div>

            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "brand", size: "lg" }),
                "h-11 px-8 font-semibold sm:col-span-2 lg:col-span-1"
              )}
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/equipment"
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "h-11 px-5 font-semibold"
            )}
          >
            Browse equipment
          </Link>
          <Link
            href="/list-equipment"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "h-11 border border-background/20 px-5 font-semibold text-background hover:bg-background/10 hover:text-background"
            )}
          >
            Become an owner
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-background/75">
          <li className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 text-brand" />
            Verified owners
          </li>
          <li className="flex items-center gap-2">
            <CreditCard aria-hidden="true" className="size-4 text-brand" />
            Secure Stripe payments
          </li>
          <li className="flex items-center gap-2">
            <Star aria-hidden="true" className="size-4 fill-brand text-brand" />
            4.8 average rating
          </li>
        </ul>
      </div>
    </section>
  );
}

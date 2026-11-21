import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  tagline: string;
  children: ReactNode;
};

/**
 * Split-screen layout used by the login and signup pages.
 * The left panel holds the RentPro branding; the right panel holds the form.
 */
export function AuthShell({ tagline, children }: AuthShellProps) {
  return (
    <main className="dark flex min-h-svh flex-1 flex-col bg-background text-foreground lg:flex-row">
      {/* Brand panel */}
      <section className="flex flex-col justify-end bg-card px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-16">
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold tracking-tight"
        >
          Rent<span className="text-brand">Pro</span>
        </Link>

        <p className="mt-6 max-w-lg font-heading text-2xl leading-snug font-bold tracking-tight sm:text-3xl">
          {tagline}
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center bg-card/75 px-6 py-12 sm:px-10 lg:py-16">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Browse equipment", href: "/equipment" },
  { label: "How it works", href: "/how-it-works" },
  { label: "List your equipment", href: "/list-equipment" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-background/10 bg-foreground text-background">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="font-heading text-xl font-extrabold tracking-tight"
        >
          Rent<span className="text-brand">Pro</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-background/80 transition-colors hover:text-background"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm font-medium text-background/80 transition-colors hover:text-background"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "px-4 font-semibold"
            )}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-background/80 transition-colors hover:bg-background/10 hover:text-background lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-background/10 lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex w-full max-w-5xl flex-col px-4 py-3 sm:px-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-md px-2 py-3 text-sm font-medium text-background/80 transition-colors hover:bg-background/10 hover:text-background"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-md px-2 py-3 text-sm font-medium text-background/80 transition-colors hover:bg-background/10 hover:text-background"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ variant: "brand", size: "lg" }),
                "mt-3 w-full px-4 font-semibold"
              )}
            >
              Sign up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, UserRound, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Browse equipment", href: "/equipment" },
  { label: "How it works", href: "/how-it-works" },
  { label: "List your equipment", href: "/list-equipment" },
];

function getDashboardPath(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "owner") return "/dashboard/owner";
  return "/dashboard/customer";
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    await authClient.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
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
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!isPending && user ? (

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-background/10">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand text-foreground">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                {user.name}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p>{user.name}</p>
                    <p className="font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push(dashboardPath)}>
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isPending && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-background/80 transition-colors hover:text-background"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "px-4 font-semibold"
                  )}
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-background/80 transition-colors hover:bg-background/10 hover:text-background lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </nav>

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

            {!isPending && (
              user ? (
                <>
                  <div className="my-2 border-t border-background/10" />
                  <p className="px-2 py-2 text-sm font-medium">
                    {user.name}
                  </p>
                  <Link
                    href={dashboardPath}
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-md px-2 py-3 text-sm hover:bg-background/10"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-md px-2 py-3 text-left text-sm text-background/80 hover:bg-background/10"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-md px-2 py-3 text-sm font-medium hover:bg-background/10"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "mt-3 w-full px-4 font-semibold"
                    )}
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

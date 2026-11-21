import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in · RentPro",
  description: "Log in to manage your RentPro bookings and listings.",
};

export default function LoginPage() {
  return (
    <AuthShell tagline="Every job starts with the right machine.">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log in to manage bookings and listings.
      </p>

      <LoginForm />

      <p className="mt-5 text-sm text-muted-foreground">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand transition-colors hover:text-brand/80"
        >
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}

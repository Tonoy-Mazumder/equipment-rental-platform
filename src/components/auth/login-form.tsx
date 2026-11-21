"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField, AuthInput } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/**
 * Reusable email + password login form powered by BetterAuth.
 * Renders its own fields, buttons and error message.
 */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    const formData = new FormData(event.currentTarget);

    const { error } = await authClient.signIn.email({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });

    if (error) {
      setError(error.message || "Could not log you in. Please try again.");
      return;
    }

    const { data: session, error: sessionError } =
      await authClient.getSession();

    if (sessionError || !session?.user) {
      setError("Could not retrieve your session. Please try again.");
      return;
    }

    const role = session?.user?.role;

    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "owner") {
      router.push("/dashboard/owner");
    } else {
      router.push("/dashboard/customer");
    }

    router.refresh();
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <AuthField label="Email" htmlFor="email">
        <AuthInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tonoy@example.com"
          required
        />
      </AuthField>

      <AuthField
        label="Password"
        htmlFor="password"
        hint="At least 8 characters"
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </AuthField>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          variant="brand"
          disabled={isSubmitting}
          className="h-10 w-full text-sm font-semibold"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full text-sm font-medium dark:bg-input/40 dark:hover:bg-input/50"
        >
          Continue with Google
        </Button>
      </div>
    </form>
  );
}

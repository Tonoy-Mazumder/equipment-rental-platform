
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          router.replace("/login");
          return;
        }

        const role = data.user.role;

        if (role === "admin") {
          router.replace("/dashboard/admin");
        } else if (role === "owner") {
          router.replace("/dashboard/owner");
        } else {
          router.replace("/dashboard/customer");
        }
      } catch {
        router.replace("/login");
      }
    }

    redirectUser();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
          <ShieldCheck className="h-8 w-8 text-brand" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to RentPro
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Securely connecting your account...
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-brand" />

          <span className="text-sm font-medium text-foreground">
            Signing you in...
          </span>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    </main>
  );
}

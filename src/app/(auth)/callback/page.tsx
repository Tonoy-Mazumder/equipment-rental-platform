"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
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
    }

    redirectUser();
  }, [router]);

  return <p className="p-8 text-center">Signing you in...</p>;
}
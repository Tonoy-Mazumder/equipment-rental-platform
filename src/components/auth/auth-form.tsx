
"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

type AuthFormProps = {
  children: ReactNode;
  className?: string;
  userRole: "customer" | "owner";
};

export function AuthForm({
  children,
  className,
  userRole,
}: AuthFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const image = String(formData.get("image") || "").trim();

    if (!name || !email || !password) {
      toast.add({
        title: "Missing information",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (image) {
      try {
        const imageUrl = new URL(image);

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error("Invalid image URL");
        }
      } catch {
        toast.add({
          title: "Invalid image URL",
          description: "Please enter a valid image URL.",
          type: "error",
        });
        return;
      }
    }

    if (password.length < 8) {
      toast.add({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        type: "error",
      });
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.add({
        title: "Weak password",
        description: "Include at least one uppercase letter.",
        type: "error",
      });
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.add({
        title: "Weak password",
        description: "Include at least one lowercase letter.",
        type: "error",
      });
      return;
    }

    if (!/[0-9]/.test(password)) {
      toast.add({
        title: "Weak password",
        description: "Include at least one number.",
        type: "error",
      });
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.add({
        title: "Weak password",
        description: "Include at least one special character.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        role: userRole,
      });

      if (error || !data?.user) {
        toast.add({
          title: "Signup failed",
          description: error?.message || "Could not create your account.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Account created",
        description: "Please log in with your new account.",
        type: "success",
      });

      router.push("/login");
    } catch {
      toast.add({
        title: "Something went wrong",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}

      <button
        type="submit"
        disabled={isSubmitting}
        className="sr-only"
      >
        Create account
      </button>
    </form>
  );
}

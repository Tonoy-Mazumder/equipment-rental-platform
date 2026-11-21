"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";

type AuthFormProps = {
  children: ReactNode;
  className?: string;
  userRole: "customer" | "owner";
};

/**
 * Small wrapper that stops the browser from reloading the page on submit.
 * Authentication is not wired up yet.
 */
export function AuthForm({ children, className,userRole }: AuthFormProps) {
  const router = useRouter()
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const userData = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
       role: userRole,
    };
    const {data,error } = await authClient.signUp.email({
      ...userData,
      
    })
    if(data?.user){
      console.log('form data',data);
      router.push('/login')
    }
    else{
      console.log(error);
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

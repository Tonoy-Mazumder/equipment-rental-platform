"use client";

import Link from "next/link";
import { AccountTypeToggle } from "@/components/auth/account-type-toggle";
import { AuthField, AuthInput } from "@/components/auth/auth-field";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// export const metadata: Metadata = {
//     title: "Sign up · RentPro",
//     description: "Create a RentPro account to rent or list equipment.",
// };
type UserRole = "customer" | "owner";
export default function SignupPage() {
    const [userRole, setuserRole] = useState<UserRole>("customer");
    useEffect(() => {
        document.title = "Sign up · RentPro";
    }, []);

    return (
        <AuthShell tagline="Rent it. List it. Earn from it.">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>

            <AccountTypeToggle className="mt-4" selected={userRole}
                onChange={setuserRole} />

            <AuthForm className="mt-6 space-y-4"
             userRole={userRole} 
             >
                <AuthField label="Full name" htmlFor="name">
                    <AuthInput
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Tonoy Mazumder"
                    />
                </AuthField>

                <AuthField label="Email" htmlFor="email">
                    <AuthInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="tonoy@example.com"
                    />
                </AuthField>

                <AuthField label="Password" htmlFor="password">
                    <PasswordInput
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />
                </AuthField>

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="brand"
                        className="h-10 w-full text-sm font-semibold"
                    >
                        Create account
                    </Button>
                </div>
            </AuthForm>

            <p className="mt-5 text-sm text-muted-foreground">
                Have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-brand transition-colors hover:text-brand/80"
                >
                    Log in
                </Link>
            </p>
        </AuthShell>
    );
}

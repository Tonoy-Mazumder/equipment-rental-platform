"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

// Auth pages use a full-screen split layout, so they hide the site chrome.
const authRoutes = ["/login", "/signup"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

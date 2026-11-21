
"use client";

import { usePathname } from "next/navigation";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const roleFromPath = pathname.split("/")[2];

  const role =
    roleFromPath === "owner" ||
      roleFromPath === "customer" ||
      roleFromPath === "admin"
      ? roleFromPath
      : "customer";
  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />

      <SidebarInset className="bg-white">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <span className="font-semibold capitalize">
            {role} Dashboard
          </span>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

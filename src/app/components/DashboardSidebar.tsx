
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { dashboardMenus, DashboardRole } from "../dashboard/dashboard-menu";


type DashboardSidebarProps = {
  role: DashboardRole;
};

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const basePath = `/dashboard/${role}`;
  const menuItems = dashboardMenus[role];

  // Navigate and close the mobile sheet (no-op on desktop).
  const navigate = (url: string) => {
    router.push(url);
    setOpenMobile(false);
  };

  return (
    <Sidebar className="dark">
      <SidebarHeader className="px-5 py-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">
            Rent<span className="text-[#F28C28]">Pro</span>
          </h2>
          <p className="mt-1 text-xs text-white/50 capitalize">
            {role} Workspace
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const url = `${basePath}${item.path}`;
                const isActive = pathname === url ||
                  (item.path !== "" && pathname.startsWith(`${url}/`));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => navigate(url)}
                      className="h-11 text-foreground/70 hover:bg-muted hover:text-foreground data-active:bg-[#F28C28] data-active:text-white"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>

          {role === "owner" && (
            <SidebarGroupAction
              title="Add Equipment"
              onClick={() => navigate(`${basePath}/equipment/new`)}
              className="text-foreground hover:bg-muted"
            >
              <Plus />
              <span className="sr-only">Add Equipment</span>
            </SidebarGroupAction>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")}
              className="text-foreground/70 hover:bg-muted hover:text-foreground"
            >
              <LogOut />
              <span>Back to Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

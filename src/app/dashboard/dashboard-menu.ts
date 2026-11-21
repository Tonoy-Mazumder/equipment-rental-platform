
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  DollarSign,
  Users,
  Heart,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

export type DashboardRole = "owner" | "customer" | "admin";

export const dashboardMenus = {
  owner: [
    { title: "Overview", path: "", icon: LayoutDashboard },
    { title: "My Equipment", path: "/equipment", icon: Package },
    { title: "Rental Requests", path: "/requests", icon: CalendarDays },
    { title: "Earnings", path: "/earnings", icon: DollarSign },
    { title: "Settings", path: "/settings", icon: Settings },
  ],

  customer: [
    { title: "Overview", path: "", icon: LayoutDashboard },
    { title: "My Bookings", path: "/bookings", icon: CalendarDays },
    { title: "Wishlist", path: "/wishlist", icon: Heart },
    { title: "Payments", path: "/payments", icon: CreditCard },
    { title: "Settings", path: "/settings", icon: Settings },
  ],

  admin: [
    { title: "Overview", path: "", icon: LayoutDashboard },
    { title: "Users", path: "/users", icon: Users },
    { title: "Equipment", path: "/equipment", icon: Package },
    { title: "Bookings", path: "/bookings", icon: CalendarDays },
    { title: "Reports", path: "/reports", icon: BarChart3 },
    { title: "Settings", path: "/settings", icon: Settings },
  ],
};

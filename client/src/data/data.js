import { Home, LayoutDashboard, User2, LogOut } from "lucide-react";

export const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Sign In",
    href: "/sign-in",
    notAuthenticatedOnly: true,
  },
  {
    label: "About",
    href: "/about",
  },
];

export const dashboardNavLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User2,
  },
  {
    label: "Logout",
    icon: LogOut,
  },
];

import {
  Home,
  LayoutDashboard,
  User2,
  FileText,
  SquarePen,
  Users,
  LogOut,
} from "lucide-react";

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
    label: "Posts",
    href: "/dashboard/my-posts",
    icon: FileText,
    adminEditorOnly: true,
  },
  {
    label: "Create Post",
    href: "/create-post",
    icon: SquarePen,
    adminEditorOnly: true,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Logout",
    icon: LogOut,
  },
];

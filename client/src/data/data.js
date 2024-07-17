import {
  Home,
  LayoutDashboard,
  User2,
  FileText,
  MessageCircleMore,
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
    adminEditorOnly: true,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User2,
  },
  {
    label: "Posts",
    href: "/dashboard/posts",
    icon: FileText,
    adminEditorOnly: true,
  },
  {
    label: "Comments",
    href: "/dashboard/comments",
    icon: MessageCircleMore,
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

export const defaultPostCategories = [
  "javascript",
  "next.js",
  "react",
  "node.js",
];

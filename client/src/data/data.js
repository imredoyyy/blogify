import {
  Home,
  LayoutDashboard,
  User2,
  FileText,
  MessageCircleMore,
  SquarePen,
  Users,
  LogOut,
  Github,
  Linkedin,
  Facebook,
  Instagram,
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

export const socialLinks = [
  {
    label: "Github",
    href: "https://github.com/imredoyyy",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "/",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "/",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "/",
    icon: Instagram,
  },
];

export const footerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Privacy Policy",
    href: "/",
  },
  {
    label: "Contact",
    href: "/",
  },
];

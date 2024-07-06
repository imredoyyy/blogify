import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/user-slice";

import { dashboardNavLinks } from "../data/data";
import { NavButton } from "./nav-button";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const DashboardSideNav = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const canPost =
    currentUser?.role === "admin" || currentUser?.role === "editor";

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Something went wrong while signing out!");
      }

      dispatch(signOut());
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="mt-5 flex flex-col gap-4 px-4 py-4 lg:mt-9 lg:px-6">
      {dashboardNavLinks.map((link, i) => {
        // Check if the link should be rendered based on user role
        if (link.adminEditorOnly && !canPost) {
          return null;
        }

        return link.href ? (
          <NavButton
            key={i}
            href={link.href}
            label={link.label}
            icon={link.icon}
            className="justify-start transition-colors"
          />
        ) : (
          <Button
            key={i}
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start gap-3 border-none bg-transparent text-muted-foreground outline-none transition hover:bg-muted-foreground/30 md:text-base"
          >
            <span>{React.createElement(link.icon)}</span>
            {link.label}
          </Button>
        );
      })}
    </nav>
  );
};

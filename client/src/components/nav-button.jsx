import { NavLink, useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export const NavButton = ({ href, label }) => {
  const { pathname } = useLocation();

  const isActive = pathname === href;

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "border-none bg-transparent outline-none transition md:text-base",
        !isActive && "text-muted-foreground",
      )}
    >
      <NavLink to={href}>{label}</NavLink>
    </Button>
  );
};

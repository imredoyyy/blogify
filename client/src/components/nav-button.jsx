import { NavLink, useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import React from "react";

export const NavButton = ({ href, label, icon, className }) => {
  const { pathname } = useLocation();

  const isActive = pathname === href;

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full border-none bg-transparent outline-none transition hover:bg-muted-foreground/30 md:text-base",
        isActive ? "bg-muted-foreground/30" : "text-muted-foreground",
        icon && "gap-3",
        className,
      )}
    >
      <NavLink to={href}>
        {icon && (
          <span className="[&>svg]:size-[22px]">
            {React.createElement(icon)}
          </span>
        )}{" "}
        {label}
      </NavLink>
    </Button>
  );
};

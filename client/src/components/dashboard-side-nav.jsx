import React from "react";

import { dashboardNavLinks } from "../data/data";
import { NavButton } from "./nav-button";
import { Button } from "./ui/button";

export const DashboardSideNav = () => {
  return (
    <nav className="mt-5 flex flex-col gap-4 px-4 py-4 lg:mt-9 lg:px-6">
      {dashboardNavLinks.map((link, i) =>
        link.href ? (
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
            variant="outline"
            className="w-full justify-start gap-3 border-none bg-transparent text-muted-foreground outline-none transition hover:bg-muted-foreground/30 md:text-base"
          >
            <span>{React.createElement(link.icon)}</span>
            {link.label}
          </Button>
        ),
      )}
    </nav>
  );
};

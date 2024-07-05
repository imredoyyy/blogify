import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMedia } from "react-use";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { routes } from "../data/data";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../lib/theme-toggle";
import { NavButton } from "./nav-button";
import { useIsAuthenticated } from "../utils/is-authenticated";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isMobile = useMedia("(max-width: 768px)", false);

  const handleRoute = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen} variant="left">
        <SheetTrigger>
          <Button variant="outline" size="icon" className="border-none">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col gap-y-6 px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map(
              (route, i) =>
                (!route.notAuthenticatedOnly || !isAuthenticated) && (
                  <Button
                    key={i}
                    variant={route.href === pathname ? "secondary" : "ghost"}
                    onClick={() => handleRoute(route.href)}
                    className="w-full justify-start"
                  >
                    {route.label}
                  </Button>
                ),
            )}
          </nav>
          <div className="flex items-center justify-between px-4">
            <p>Switch Theme</p>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden items-center gap-x-4 md:flex">
      {routes.map(
        (route, i) =>
          // Render the NavButton if:
          // 1. The route is not restricted to unauthenticated users (notAuthenticatedOnly is false or undefined)
          // 2. OR if it is restricted (notAuthenticatedOnly is true) and the user is not authenticated
          (!route.notAuthenticatedOnly || !isAuthenticated) && (
            <NavButton key={i} href={route.href} label={route.label} />
          ),
      )}
    </nav>
  );
};

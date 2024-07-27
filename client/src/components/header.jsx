import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { ThemeToggle } from "../lib/theme-toggle";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";
import { SearchModal } from "./search-modal";
import { cn } from "../lib/utils";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { pathname } = useLocation();

  return (
    !pathname.includes("/dashboard") && (
      <header className="sticky top-0 z-20 w-full border-b border-muted bg-muted/10 p-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          {/* Header Logo for large devices */}
          <Link to="/" className="hidden md:inline-flex">
            <h3 className="font-playfair text-2xl font-extrabold md:text-3xl">
              Blogify
            </h3>
          </Link>

          {/* Navbar */}
          <Navbar currentUser={currentUser} />

          {/* Header Logo for small devices */}
          <Link to="/" className="inline-flex md:hidden">
            <h3 className="font-playfair text-2xl font-extrabold md:text-3xl">
              Blogify
            </h3>
          </Link>

          {/* Header Right Side */}
          <div className="flex items-center gap-4">
            <SearchModal />
            <ThemeToggle className={cn("hidden md:inline-flex")} />
            {currentUser ? (
              <UserButton />
            ) : (
              <Button asChild className="hidden md:inline-flex">
                <Link to="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    )
  );
};

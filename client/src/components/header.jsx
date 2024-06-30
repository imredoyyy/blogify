import { Link } from "react-router-dom";
import { ThemeToggle } from "../lib/theme-toggle";
import { Navbar } from "./navbar";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 w-full border-b border-muted bg-muted/10 p-4 backdrop-blur-md md:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
        {/* Header Logo */}
        <Link to="/">
          <h3 className="text-2xl font-bold md:text-3xl">Blogify</h3>
        </Link>

        {/* Navbar */}
        <Navbar />
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

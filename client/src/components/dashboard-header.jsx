import { Link } from "react-router-dom";
import { ThemeToggle } from "../lib/theme-toggle";
import { UserButton } from "./user-button";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export const DashboardHeader = ({ onClick }) => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-muted p-4 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between lg:justify-end">
        <div className="flex items-center gap-2">
          <Button
            onClick={onClick}
            variant="outline"
            size="icon"
            className="border-none bg-transparent hover:bg-background lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
          <Link to="/" className="block lg:hidden">
            <h3 className="text-2xl font-bold md:text-3xl">Blogify</h3>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
          <ThemeToggle className="bg-transparent hover:bg-background" />
        </div>
      </div>
    </header>
  );
};

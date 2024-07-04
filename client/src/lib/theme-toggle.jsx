import { useTheme } from "./use-theme";

import { MoonStar, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "./utils";

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("border-none", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="absolute size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonStar className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

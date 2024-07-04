import { forwardRef } from "react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { DashboardSideNav } from "./dashboard-side-nav";

export const Sidebar = forwardRef(({ isSidebarOpen, onClose }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "absolute left-0 top-0 z-30 flex h-screen w-[18rem] -translate-x-full flex-col overflow-y-hidden bg-muted p-4 duration-300 ease-linear lg:static lg:z-10 lg:translate-x-0",
        isSidebarOpen && "translate-x-0",
      )}
    >
      <div className="flex items-center justify-between">
        <Link to="/">
          <h3 className="text-2xl font-bold">Blogify</h3>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="border-none bg-transparent hover:bg-background lg:hidden"
        >
          <X className="size-[1.2rem]" />
        </Button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <DashboardSideNav />
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

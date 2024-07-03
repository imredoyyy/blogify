import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import DummyProfile from "/icons/dummy-profile.png";

export const UserButton = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={currentUser?.image || DummyProfile}
            alt={currentUser?.name}
          />
          <AvatarFallback>
            {currentUser?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          className={cn("gap-2 focus:bg-inherit focus:text-inherit")}
        >
          <Avatar>
            <AvatarImage
              src={currentUser?.image || DummyProfile}
              alt={currentUser?.name}
            />
            <AvatarFallback>
              {currentUser?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium leading-none">
              {currentUser?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link to="/dashboard/profile">
          <DropdownMenuItem className="gap-2">
            <Settings className="size-4" />
            <span>Manage Account</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

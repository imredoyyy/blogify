import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Settings, LogOut, SquarePen } from "lucide-react";
import { cn } from "../lib/utils";
import DummyProfile from "/icons/dummy-profile.png";
import { signOut } from "../redux/user/user-slice";
import { toast } from "sonner";

export const UserButton = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const canPost =
    currentUser?.role === "admin" || currentUser?.role === "editor";

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Something went wrong while signing out!");
        return;
      }

      dispatch(signOut());
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

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
        {canPost && (
          <Link to="/create-post">
            <DropdownMenuItem className="gap-2">
              <SquarePen className="size-4" />
              <span>Create a Post</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="gap-2">
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

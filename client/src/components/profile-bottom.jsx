import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/user-slice";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { DeleteAccountPopover } from "./delete-account-popover";

export const ProfileBottom = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/signout", {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Something went wrong while signing out!");
      }

      dispatch(signOut());
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-8">
      <h3 className="text-lg font-semibold">Delete Account or Sign Out</h3>
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:w-2/3">
        <DeleteAccountPopover />
        <Button onClick={handleSignOut} className="w-full text-sm">
          <LogOut className="mr-2 size-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

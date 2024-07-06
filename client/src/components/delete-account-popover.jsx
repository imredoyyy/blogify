import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteAccount } from "../redux/user/user-slice";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2, Trash, TriangleAlert } from "lucide-react";
import { cn } from "../lib/utils";

export const DeleteAccountPopover = () => {
  const [deletingAccount, setDeletingAccount] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const userId = currentUser._id;

  const handleDelete = async () => {
    setDeletingAccount(true);

    try {
      const response = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        toast.error("Error deleting account! Please try again.");
        setDeletingAccount(false);
      }

      setDeletingAccount(true);
      toast.error("Account successfully deleted!");
      dispatch(deleteAccount());
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsPopoverOpen(true)}
        className="w-full text-sm"
      >
        <Trash className="mr-2 size-4" /> Delete Account
      </Button>
      <div
        onClick={() => setIsPopoverOpen(false)}
        className={cn(
          "pointer-events-none absolute inset-0 z-[100] grid min-h-screen w-full place-items-center bg-background/60 opacity-0 transition-opacity duration-300",
          isPopoverOpen && "pointer-events-auto bg-background/50 opacity-100",
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex w-[280px] flex-col gap-6 rounded-md bg-muted p-3 shadow-2xl"
        >
          <div className="mx-auto">
            <TriangleAlert className="size-10 text-destructive" />
          </div>
          <p className="text-center text-sm">
            Are you sure you want to{" "}
            <span className="font-medium">&quot;delete&quot;</span> your
            account? <br />
            This action cannot be undone.
          </p>
          <div className="grid w-full grid-cols-1 justify-items-center gap-4">
            <Button
              type="button"
              onClick={handleDelete}
              variant="destructive"
              disabled={deletingAccount}
              className="w-full max-w-[220px] text-sm"
            >
              {deletingAccount ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              onClick={() => setIsPopoverOpen(false)}
              disabled={deletingAccount}
              className="w-full max-w-[220px] text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

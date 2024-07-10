import { useEffect } from "react";
import { toast } from "sonner";

export const OfflineToast = () => {
  useEffect(() => {
    // If users browser is offline
    if (!navigator.onLine) {
      toast.error("You are offline! Please check your internet connection!");
    }
  }, []);

  return null;
};

"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function NetworkStatusListener() {
  useEffect(() => {
    function handleOffline() {
      toast.error("No internet connection", {
        description: "Please check your network and try again.",
        duration: Infinity,
        id: "offline-toast",
      });
    }

    function handleOnline() {
      toast.dismiss("offline-toast");
      toast.success("Back online");
    }

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}

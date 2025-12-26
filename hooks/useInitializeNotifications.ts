import { useEffect } from "react";
import { useNotificationsStore } from "@/stores/notificationsStore";

export const useInitializeNotifications = () => {
  const { fetchNotifications } = useNotificationsStore();

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();

    // Also set up a polling mechanism to refresh notifications periodically
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // Refresh every 60 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);
};

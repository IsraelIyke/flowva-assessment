import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotificationsStore } from "@/stores/notificationsStore";

export const useNotificationSubscription = () => {
  const { fetchNotifications } = useNotificationsStore();

  useEffect(() => {
    let subscription: any;

    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      subscription = supabase
        .channel(`notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Notification update:", payload);
            fetchNotifications();
          }
        )
        .subscribe((status) => {
          console.log("Notification subscription:", status);
        });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [fetchNotifications]);
};

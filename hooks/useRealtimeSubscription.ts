import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRewardsStore } from "@/stores/rewardsStore";

export const useRealtimeSubscription = () => {
  const { fetchStreakData } = useRewardsStore();

  useEffect(() => {
    let subscription: any;

    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      subscription = supabase
        .channel(`user-streaks-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_streaks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime update received:", payload);
            // Refresh data when streak changes
            fetchStreakData();
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [fetchStreakData]);
};

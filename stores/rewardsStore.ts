import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface StreakHistoryItem {
  day: number;
  dayInWeek: string;
  claimed_date: string;
  points_earned: number;
}

interface StreakData {
  streak_days: number;
  streak_history: StreakHistoryItem[];
  last_claimed_date: string | null;
}

interface RewardsStore {
  // State
  streakData: StreakData | null;
  points: number; // streak points
  referralPoints: number; // referral points
  isClaimedToday: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  fetchStreakData: () => Promise<void>;
  claimDailyStreak: () => Promise<{ success: boolean; message: string }>;
  updatePoints: (newPoints: number) => void;
  setReferralPoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed
  getTotalPointsFromStreaks: () => number;
  getClaimedDays: () => number[];
  getStreakHistoryLength: () => number;
}

const initialState = {
  streakData: null,
  points: 0,
  referralPoints: 0,
  isClaimedToday: false,
  loading: false,
  error: null,
};

export const useRewardsStore = create<RewardsStore>((set, get) => ({
  ...initialState,

  fetchStreakData: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      const streakData: StreakData = data || {
        streak_days: 0,
        streak_history: [],
        last_claimed_date: null,
      };

      const safeHistory = Array.isArray(streakData.streak_history)
        ? streakData.streak_history
        : [];

      const pointsFromStreaks = safeHistory.length * 5;

      const isClaimedToday = streakData.last_claimed_date
        ? new Date(streakData.last_claimed_date).toDateString() ===
          new Date().toDateString()
        : false;

      set({
        streakData: { ...streakData, streak_history: safeHistory },
        points: pointsFromStreaks,
        isClaimedToday,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch streak data",
        loading: false,
      });
    }
  },

  claimDailyStreak: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("claim_daily_streak", {
        p_user_id: user.id,
      });

      if (error) throw error;

      if (data.status === "success") {
        const safeHistory = Array.isArray(data.streak_history)
          ? data.streak_history
          : [];

        const pointsFromStreaks = safeHistory.length * 5;

        set({
          streakData: {
            streak_days: data.streak_days,
            streak_history: safeHistory,
            last_claimed_date: new Date().toISOString(),
          },
          points: pointsFromStreaks,
          isClaimedToday: true,
          loading: false,
        });

        return { success: true, message: "Successfully claimed daily points!" };
      }

      return { success: false, message: "Already claimed today" };
    } catch (err: any) {
      set({
        error: err.message || "Failed to claim points",
        loading: false,
      });

      return { success: false, message: err.message };
    }
  },

  updatePoints: (newPoints) => set({ points: newPoints }),

  setReferralPoints: (points) => set({ referralPoints: points }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),

  getTotalPointsFromStreaks: () => {
    const history = get().streakData?.streak_history;
    return Array.isArray(history) ? history.length * 5 : 0;
  },

  getClaimedDays: () => {
    const history = get().streakData?.streak_history;
    const DAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (!Array.isArray(history)) return [];

    return history.map((h) => DAYS.indexOf(h.dayInWeek)).filter((i) => i >= 0);
  },

  getStreakHistoryLength: () => {
    const history = get().streakData?.streak_history;
    return Array.isArray(history) ? history.length : 0;
  },
}));

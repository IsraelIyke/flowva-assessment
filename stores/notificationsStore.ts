// @/stores/notificationsStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Notification {
  id: number;
  title: string;
  message: string;
  full_message?: string;
  type: "welcome" | "streak" | "achievement" | "info" | "referral";
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  selectedNotification: Notification | null;
  showDeleteWarning: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  setSelectedNotification: (notification: Notification | null) => void;
  setShowDeleteWarning: (show: boolean) => void;
  getVisibleNotifications: () => Notification[];
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  selectedNotification: null,
  showDeleteWarning: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        set({ notifications: [], unreadCount: 0, loading: false });
        return;
      }

      // Fetch notifications from notificationsandreferral table
      const { data, error } = await supabase
        .from("notificationsandreferral")
        .select("notifications")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching notifications:", error);
        set({ notifications: [], unreadCount: 0, loading: false });
        return;
      }

      // Parse the JSON notifications array
      const notificationsArray: Notification[] = data.notifications || [];

      // Sort by creation date (newest first)
      const sortedNotifications = notificationsArray.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Calculate unread count
      const unreadCount = sortedNotifications.filter((n) => !n.is_read).length;

      set({
        notifications: sortedNotifications,
        unreadCount,
        loading: false,
      });
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
      set({ notifications: [], unreadCount: 0, loading: false });
    }
  },

  markAsRead: async (notificationId: number) => {
    const { notifications } = get();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Update local state
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, is_read: true }
        : notification
    );

    const unreadCount = updatedNotifications.filter((n) => !n.is_read).length;

    set({
      notifications: updatedNotifications,
      unreadCount,
    });

    // Update in database
    try {
      // First, get current notifications
      const { data: currentData } = await supabase
        .from("notificationsandreferral")
        .select("notifications")
        .eq("user_id", user.id)
        .single();

      if (currentData) {
        // Update the specific notification in the JSON array
        const updatedJson = (currentData.notifications || []).map(
          (n: Notification) =>
            n.id === notificationId ? { ...n, is_read: true } : n
        );

        // Save back to database
        await supabase
          .from("notificationsandreferral")
          .update({ notifications: updatedJson })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert local state on error
      set({
        notifications: get().notifications,
        unreadCount: get().unreadCount,
      });
    }
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Update all notifications to read
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      is_read: true,
    }));

    set({
      notifications: updatedNotifications,
      unreadCount: 0,
    });

    // Update in database
    try {
      const { data: currentData } = await supabase
        .from("notificationsandreferral")
        .select("notifications")
        .eq("user_id", user.id)
        .single();

      if (currentData) {
        const updatedJson = (currentData.notifications || []).map(
          (n: Notification) => ({
            ...n,
            is_read: true,
          })
        );

        await supabase
          .from("notificationsandreferral")
          .update({ notifications: updatedJson })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  },

  deleteAllNotifications: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Clear local state
    set({
      notifications: [],
      unreadCount: 0,
      selectedNotification: null,
      showDeleteWarning: false,
    });

    // Update database with empty array
    try {
      await supabase
        .from("notificationsandreferral")
        .update({ notifications: [] })
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  },

  setSelectedNotification: (notification) => {
    set({ selectedNotification: notification });
  },

  setShowDeleteWarning: (show) => {
    set({ showDeleteWarning: show });
  },

  getVisibleNotifications: () => {
    const { notifications } = get();
    return notifications.slice(0, 20); // Show only first 20 notifications
  },
}));

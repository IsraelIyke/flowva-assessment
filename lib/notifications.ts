import { supabase } from "@/lib/supabase";
import { Notification } from "@/stores/notificationsStore";

export const fetchUserNotifications = async (
  userId: string
): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notificationsAndReferral")
      .select("notifications")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data.notifications || [];
  } catch (error) {
    console.error("Error in fetchUserNotifications:", error);
    return [];
  }
};

export const addNotification = async (
  userId: string,
  notification: Omit<Notification, "id">
): Promise<boolean> => {
  try {
    // Get current notifications
    const { data, error } = await supabase
      .from("notificationsAndReferral")
      .select("notifications")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching notifications for update:", error);
      return false;
    }

    // Generate new ID
    const currentNotifications: Notification[] = data.notifications || [];
    const newId =
      currentNotifications.length > 0
        ? Math.max(...currentNotifications.map((n) => n.id)) + 1
        : 1;

    const newNotification: Notification = {
      ...notification,
      id: newId,
      created_at: new Date().toISOString(),
    };

    // Add new notification to array
    const updatedNotifications = [newNotification, ...currentNotifications];

    // Update database
    const { error: updateError } = await supabase
      .from("notificationsAndReferral")
      .update({ notifications: updatedNotifications })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error adding notification:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addNotification:", error);
    return false;
  }
};

export const deleteNotification = async (
  userId: string,
  notificationId: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("notificationsAndReferral")
      .select("notifications")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching notifications for delete:", error);
      return false;
    }

    const currentNotifications: Notification[] = data.notifications || [];
    const updatedNotifications = currentNotifications.filter(
      (n) => n.id !== notificationId
    );

    const { error: updateError } = await supabase
      .from("notificationsAndReferral")
      .update({ notifications: updatedNotifications })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error deleting notification:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return false;
  }
};

export const getUserReferralCode = async (
  userId: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("notificationsAndReferral")
      .select("referral_code")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching referral code:", error);
      return null;
    }

    return data.referral_code;
  } catch (error) {
    console.error("Error in getUserReferralCode:", error);
    return null;
  }
};

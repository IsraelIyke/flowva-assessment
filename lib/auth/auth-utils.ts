// /lib/auth/auth-utils.ts
import { supabase } from "@/lib/supabase";

// Constants for localStorage keys
export const REFERRAL_STORAGE_KEY = "flowva_referral_data";
export const REFERRAL_PROCESSED_KEY = "flowva_referral_processed";

// Store referral code in localStorage
export const storeReferralCode = (referralCode: string) => {
  const referralData = {
    code: referralCode,
    source: "direct_link",
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referralData));
  console.log("Referral code saved to localStorage:", referralCode);
};

// Function to create notifications and referral code for a user
export const createUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "create_user_notifications_and_referral",
      { p_user_id: userId }
    );

    if (error) {
      console.error("Error creating notifications:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error in createUserNotifications:", err);
    return null;
  }
};

// Function to process referral for a user
export const processUserReferral = async (userId: string) => {
  try {
    // Get stored referral data
    const storedRef = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!storedRef) return false;

    const referralData = JSON.parse(storedRef);
    const referralCode = referralData.code;

    console.log("Processing referral for user:", userId, "Code:", referralCode);

    // Find the referrer using the referral code
    const { data: referrerData, error: referrerError } = await supabase
      .from("notificationsandreferral")
      .select("user_id, referral_code")
      .eq("referral_code", referralCode)
      .single();

    if (referrerError || !referrerData) {
      console.error("Referrer not found:", referrerError);
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return false;
    }

    // Prevent self-referral
    if (referrerData.user_id === userId) {
      console.log("Cannot refer yourself");
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return false;
    }

    // Update the current user's record with referral info
    const { error: updateError } = await supabase
      .from("notificationsandreferral")
      .update({
        referred_by: referrerData.user_id,
        referral_source: referralData.source || "direct_link",
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating referral relationship:", updateError);
      return false;
    }

    console.log("Referral processed successfully!");

    // Mark as processed and clean up
    localStorage.removeItem(REFERRAL_PROCESSED_KEY);
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error in processUserReferral:", error);
    return false;
  }
};

// Helper function to ensure user has notifications record and process referral
export const ensureUserHasNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notificationsandreferral")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    // If no record exists, create one
    if (error && error.code === "PGRST116") {
      console.log("Creating notifications for user:", userId);
      await createUserNotifications(userId);
    }

    // Process referral if stored in localStorage
    await processUserReferral(userId);
  } catch (err) {
    console.error("Error checking notifications:", err);
  }
};

// Check if user is already logged in
export const checkUserSession = async (router: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    router.push("/dashboard/earn-rewards");
    return true;
  }
  return false;
};

// /app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  createUserNotifications,
  processUserReferral,
  REFERRAL_STORAGE_KEY,
  REFERRAL_PROCESSED_KEY,
} from "@/lib/auth/auth-utils";

export default function AuthCallback() {
  const router = useRouter();

  const processReferralAndCreateNotifications = async (userId: string) => {
    try {
      // ✅ CREATE NOTIFICATIONS FOR THE NEW USER FIRST
      await createUserNotifications(userId);

      // Check if referral was already processed
      if (localStorage.getItem(REFERRAL_PROCESSED_KEY) === "true") {
        return;
      }

      // Check for stored referral code
      const storedRef = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!storedRef) return;

      const referralData = JSON.parse(storedRef);
      const referralCode = referralData.code;

      // Find the referrer using the referral code
      const { data: referrerData, error: referrerError } = await supabase
        .from("notificationsandreferral")
        .select("user_id, referral_code")
        .eq("referral_code", referralCode)
        .single();

      if (referrerError || !referrerData) {
        console.log("Referrer not found or invalid referral code");
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
        return;
      }

      // Prevent self-referral
      if (referrerData.user_id === userId) {
        console.log("Cannot refer yourself");
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
        return;
      }

      // Store the referral relationship
      await processUserReferral(userId);

      // Mark as processed and clean up
      localStorage.setItem(REFERRAL_PROCESSED_KEY, "true");
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch (error) {
      console.error("Error processing referral:", error);
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        // Wait a moment for the session to be fully established
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (session?.user) {
          const userId = session.user.id;

          // ✅ Process referral and create notifications for OAuth users
          await processReferralAndCreateNotifications(userId);

          // Redirect to dashboard
          router.push("/dashboard/earn-rewards");
        } else {
          // No session found, try to get it from URL
          const {
            data: { session: urlSession },
          } = await supabase.auth.getSession();

          if (urlSession?.user) {
            await processReferralAndCreateNotifications(urlSession.user.id);
            router.push("/dashboard/earn-rewards");
          } else {
            // No session at all, redirect to login
            router.push("/signin");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.push("/signin");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/logo/flowva_logo.png"
          alt="logo"
          className=" animate-pulse"
          width={300}
          height={300}
        />

        <p className="mt-4 text-gray-600">Completing sign in...</p>
        <p className="text-sm text-gray-500 mt-2">Setting up your account...</p>
      </div>
    </div>
  );
}

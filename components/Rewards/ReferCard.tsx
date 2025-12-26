"use client";

import { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import { LuUsers, LuCopy, LuCheck } from "react-icons/lu";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { supabase } from "@/lib/supabase";
import { useRewardsStore } from "@/stores/rewardsStore";

export default function ReferCard() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [userName, setUserName] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referralsCount, setReferralsCount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUserName("Guest");
          setReferralCode("guest3825");
          setReferralLink("https://app.flowvahub.com/signup?ref=guest3825");
          setLoading(false);
          return;
        }

        // Fetch user display name
        let displayName = "User";
        if (user.email) {
          const emailPrefix = user.email.split("@")[0];
          displayName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            emailPrefix ||
            "User";
        }
        setUserName(displayName);

        // Fetch referral code from notificationsandreferral table
        const { data: referralData, error: referralError } = await supabase
          .from("notificationsandreferral")
          .select("referral_code, referred_by, referral_source")
          .eq("user_id", user.id)
          .single();

        if (referralError) {
          console.error("Error fetching referral code:", referralError);
          // If no record exists, try to create one
          try {
            const { error: createError } = await supabase.rpc(
              "create_user_notifications_and_referral",
              { p_user_id: user.id }
            );

            if (createError) {
              console.error("Error creating notifications:", createError);
              // Fallback to email prefix
              const fallbackCode = user.email
                ? user.email.split("@")[0]
                : "user123";
              setReferralCode(fallbackCode);
              setReferralLink(
                `https://app.flowvahub.com/signup?ref=${fallbackCode}`
              );
            } else {
              // Refetch after creation
              const { data: newData } = await supabase
                .from("notificationsandreferral")
                .select("referral_code")
                .eq("user_id", user.id)
                .single();

              if (newData?.referral_code) {
                const code = newData.referral_code;
                setReferralCode(code);
                setReferralLink(`https://app.flowvahub.com/signup?ref=${code}`);
              }
            }
          } catch (createErr) {
            console.error("Error in fallback creation:", createErr);
            const fallbackCode = user.email
              ? user.email.split("@")[0]
              : "user123";
            setReferralCode(fallbackCode);
            setReferralLink(
              `https://app.flowvahub.com/signup?ref=${fallbackCode}`
            );
          }
        } else if (referralData?.referral_code) {
          // Successfully fetched referral code
          const code = referralData.referral_code;
          setReferralCode(code);
          setReferralLink(`https://app.flowvahub.com/signup?ref=${code}`);
        }

        // Fetch referral stats (number of users this user referred)
        if (referralData?.referral_code) {
          const { data: referredUsers, error: statsError } = await supabase
            .from("notificationsandreferral")
            .select("user_id")
            .eq("referred_by", user.id);

          if (!statsError && referredUsers) {
            const earned = referredUsers.length * 25;

            setReferralsCount(referredUsers.length);
            setPointsEarned(earned);
            setReferralPoints(earned); // 🔑 THIS LINE
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load referral data");
        setUserName("Guest");
        setReferralCode("guest3825");
        setReferralLink("https://app.flowvahub.com/signup?ref=guest3825");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const setReferralPoints = useRewardsStore((state) => state.setReferralPoints);

  const handleCopy = () => {
    if (referralLink) {
      copy(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareMessage = `🚀 Join me on Flowva!\n\nUse my referral link to sign up and get rewarded too:\n${referralLink}`;
  const encodedShareMessage = encodeURIComponent(shareMessage);

  const socialShareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedShareMessage}`,
    twitter: `https://x.com/intent/tweet?text=${encodedShareMessage}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      referralLink
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralLink
    )}`,
  };

  const handleSocialShare = (platform: keyof typeof socialShareUrls) => {
    if (referralLink) {
      window.open(socialShareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="w-full mx-auto font-sans mt-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-[5px] h-9 bg-[#a800ff] rounded-full" />
          <h2 className="text-[25px] font-semibold text-[#111827]">
            Refer & Earn
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto font-sans mt-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-[5px] h-9 bg-[#a800ff] rounded-full" />
        <h2 className="text-[25px] font-semibold text-[#111827]">
          Refer & Earn
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md overflow-hidden transition-shadow">
        {/* Header */}
        <div className="bg-[#f0f4ff] p-4 flex items-center gap-4">
          <LuUsers className="text-[#a800ff] text-2xl" />
          <div>
            <h3 className="text-[20px] font-semibold text-slate-800">
              Share Your Link
            </h3>
            <p className="text-slate-500 text-[14px]">
              Invite friends and earn 25 points when they join!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 py-8">
          <div className="text-center border-r border-slate-100">
            <p className="text-[26px] font-black text-[#a800ff] mb-2">
              {referralsCount}
            </p>
            <p className="text-slate-800 text-[14px] font-medium">Referrals</p>
          </div>
          <div className="text-center">
            <p className="text-[26px] font-black text-[#a800ff] mb-2">
              {pointsEarned}
            </p>
            <p className="text-slate-800 text-[14px] font-medium">
              Points Earned
            </p>
          </div>
        </div>

        {/* Link Area */}
        <div className="px-8 pb-8">
          <div className="bg-[#fdfaff] rounded-[24px] p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-slate-500 text-[15px] font-medium">
                Your personal referral link:
              </label>
            </div>

            <div className="relative group">
              <input
                readOnly
                value={referralLink}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-600 outline-none font-medium"
              />
              <button
                onClick={handleCopy}
                disabled={!referralLink}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                  referralLink
                    ? "hover:bg-slate-50"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <LuCheck className="bg-white p-0.5" size={22} />
                  </div>
                ) : (
                  <LuCopy
                    className={`${
                      referralLink ? "text-[#a800ff]" : "text-gray-400"
                    } bg-white p-0.5`}
                    size={22}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-2 pb-6">
          {[
            { id: "facebook", icon: <FaFacebookF />, color: "bg-[#3b5998]" },
            { id: "twitter", icon: <FaXTwitter />, color: "bg-black" },
            { id: "linkedin", icon: <FaLinkedinIn />, color: "bg-[#0077b5]" },
            { id: "whatsapp", icon: <FaWhatsapp />, color: "bg-[#25d366]" },
          ].map((social) => (
            <button
              key={social.id}
              onClick={() => handleSocialShare(social.id as any)}
              disabled={!referralLink}
              className={`w-8 h-8 rounded-full ${
                social.color
              } flex items-center justify-center text-white transition-all ${
                referralLink
                  ? "hover:-translate-y-0.5 active:scale-95"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

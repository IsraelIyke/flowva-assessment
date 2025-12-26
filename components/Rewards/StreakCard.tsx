"use client";

import { useState, useRef, useEffect } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { IoFlashOutline } from "react-icons/io5";
import { FiCheckCircle, FiX } from "react-icons/fi";
import confetti from "canvas-confetti";
import { useRewardsStore } from "@/stores/rewardsStore";

// Day mapping
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function StreakCard() {
  const {
    streakData,
    isClaimedToday,
    loading: storeLoading,
    claimDailyStreak,
    getClaimedDays,
  } = useRewardsStore();

  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const claimedDays = getClaimedDays();

  // Safe access to streak days
  const streakDays = streakData?.streak_days || 0;

  // Trigger Confetti when popup opens
  useEffect(() => {
    if (showCongratsPopup) {
      // Primary Burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a800ff", "#ff5db1", "#22c55e", "#ff8a00", "#4dbfff"],
      });

      // Secondary delayed side bursts
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#a800ff", "#ff5db1"],
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#a800ff", "#ff5db1"],
        });
      }, 200);
    }
  }, [showCongratsPopup]);

  // Close popup with Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showCongratsPopup) {
        setShowCongratsPopup(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showCongratsPopup]);

  const handleClaimPoints = async () => {
    if (isClaimedToday) return;

    setClaiming(true);

    try {
      const result = await claimDailyStreak();

      if (result.success) {
        // Show congrats popup after a short delay
        setTimeout(() => {
          setShowCongratsPopup(true);
        }, 500);
      }
    } finally {
      setClaiming(false);
    }
  };

  const closeCongratsPopup = () => {
    setShowCongratsPopup(false);
  };

  const getButtonConfig = () => {
    if (isClaimedToday) {
      return {
        text: "Claimed",
        bgColor: "bg-gray-300",
        hoverColor: "",
        cursor: "cursor-not-allowed",
        icon: <IoFlashOutline className="text-2xl" />,
        disabled: true,
      };
    }

    if (claiming) {
      return {
        text: "Claiming...",
        bgColor: "bg-gray-400",
        hoverColor: "",
        cursor: "cursor-not-allowed",
        icon: null,
        disabled: true,
      };
    }

    return {
      text: "Claim Today's Points",
      bgColor: "bg-[#9900ff]",
      hoverColor: "hover:bg-[#9200e0]",
      cursor: "cursor-pointer",
      icon: <IoFlashOutline className="text-2xl" />,
      disabled: false,
    };
  };

  const buttonConfig = getButtonConfig();

  // Loading State
  if (storeLoading && !streakData) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100">
        <div className="bg-[#f0f4ff] p-6">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
        <div className="p-6 px-4 flex flex-col items-center">
          <div className="w-full mb-5">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex justify-between w-full mb-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-11 h-11 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="w-full h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-600 ease-out hover:-translate-y-1">
        {/* Header Section */}
        <div className="bg-[#f0f4ff] p-6 flex items-center gap-3  rounded-t-2xl">
          <div className="text-[#4dbfff] text-xl">
            <FaRegCalendar />
          </div>
          <h3 className="text-[18px] font-semibold text-[#334155]">
            Daily Streak
          </h3>
        </div>

        {/* Main Content Body */}
        <div className="p-6 px-4 flex flex-col items-center">
          {/* Streak Number */}
          <div className="w-full text-left mb-5">
            <h1 className="text-[36px] font-black text-[#9d00ff] leading-none tracking-tight">
              {streakDays} day{streakDays !== 1 ? "s" : ""}
            </h1>
          </div>

          {/* Days of the Week Tracker */}
          <div className="flex justify-between w-full mb-6">
            {DAYS.map((day, i) => {
              const isToday = i === todayIndex + 1;
              const isClaimed = claimedDays.includes(i);

              return (
                <div
                  key={i}
                  className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold m-0.5 relative
                    ${
                      isToday
                        ? "border-[3px] border-[#a800ff] outline outline-white -outline-offset-4"
                        : ""
                    }
                    ${
                      isClaimed
                        ? "bg-linear-to-br from-purple-500 to-purple-600 text-white"
                        : "bg-gray-200 text-[#64748b]"
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Info Text */}
          <p className="text-[#64748b] text-[14px] mb-2">
            Check in daily to earn +5 points
          </p>

          {/* Action Button */}
          <button
            onClick={handleClaimPoints}
            disabled={buttonConfig.disabled}
            className={`w-full ${buttonConfig.bgColor} ${buttonConfig.hoverColor} active:scale-95 transition-all text-white py-5 rounded-full font-bold text-sm flex items-center justify-center gap-3 h-6 ${buttonConfig.cursor}`}
          >
            {buttonConfig.icon}
            {buttonConfig.text}
          </button>
        </div>
      </div>

      {/* Congrats Popup */}
      {showCongratsPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeCongratsPopup}
          />

          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-10 px-4 pt-14 text-center relative animate-in zoom-in duration-300 pointer-events-auto">
              <button
                onClick={closeCongratsPopup}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={22} />
              </button>

              {/* Green Checkmark Circle */}
              <div className="relative mb-2 flex justify-center">
                <FiCheckCircle size={90} className="text-[#22c55e] stroke-2" />
              </div>

              {/* Level Up! Section */}
              <h2 className="text-[19px] font-bold text-[#a800ff] mb-2 flex items-center justify-center gap-2">
                Level Up! <span className="text-[18px]">🎉</span>
              </h2>

              {/* linear Points Text */}
              <div className="text-[32px] font-black bg-linear-to-r from-[#a800ff] to-[#ff5db1] bg-clip-text text-transparent mb-4">
                +5 Points
              </div>

              {/* Bouncing Icons Row */}
              <div className="flex justify-center gap-1 mb-2">
                <span
                  className="text-sm animate-subtle-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  ✨
                </span>
                <span
                  className="text-sm animate-subtle-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  💎
                </span>
                <span
                  className="text-sm animate-subtle-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  🎯
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-snug px-4">
                You've claimed your daily points! Come back tomorrow for more!
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

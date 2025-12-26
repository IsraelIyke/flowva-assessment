"use client";

import { useEffect, useState } from "react";
import { FaAward } from "react-icons/fa6";
import { useRewardsStore } from "@/stores/rewardsStore";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface PointsCardProps {
  targetPoints?: number;
}

export default function PointsCard({ targetPoints = 5000 }: PointsCardProps) {
  const {
    points,
    referralPoints,
    loading,
    error,
    streakData,
    fetchStreakData,
  } = useRewardsStore();

  const [flipTrigger, setFlipTrigger] = useState(0);

  useRealtimeSubscription();

  const totalPoints = points + referralPoints;

  const progressPercentage = Math.min((points / targetPoints) * 100, 100);

  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData]);

  // Trigger the flip animation whenever points change
  useEffect(() => {
    if (points > 0) {
      setFlipTrigger((prev) => prev + 1);
    }
  }, [points]);

  const streakHistoryLength = streakData?.streak_history?.length || 0;

  if (loading && !streakData) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 font-sans">
        <div className="bg-[#f0f4ff] p-6 flex items-center gap-3">
          <div className="animate-pulse w-6 h-6 bg-gray-300 rounded"></div>
          <div className="animate-pulse h-4 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="p-8 px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="animate-pulse h-10 bg-gray-200 rounded w-24"></div>
            <div className="animate-pulse w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3 mb-2">
            <div className="flex justify-between items-end text-[14px]">
              <span className="animate-pulse h-3 bg-gray-200 rounded w-36"></span>
              <span className="animate-pulse h-3 bg-gray-200 rounded w-16"></span>
            </div>
            <div className="animate-pulse h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 font-sans transition-all duration-600 ease-out hover:-translate-y-1">
      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes flip-once {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        .animate-flip-once {
          animation: flip-once 0.8s ease-in-out;
        }
      `}</style>

      <div className="bg-[#f0f4ff] p-6 flex items-center gap-3">
        <FaAward className="text-[#a800ff] text-xl" />
        <h3 className="text-[18px] font-semibold text-[#334155]">
          Points Balance
        </h3>
      </div>

      <div className="p-8 px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="relative">
            <h1 className="text-[36px] font-black text-[#a800ff] leading-none transition-all duration-300">
              {totalPoints.toLocaleString()}
            </h1>
          </div>

          {/* Gold Star Coin Icon and the key prop re triggers animation */}
          <GoldenStarCoin
            key={flipTrigger}
            size={46}
            className="mr-8 animate-flip-once"
          />
        </div>

        <div className="space-y-3 mb-2">
          <div className="flex justify-between items-end text-[14px] font-medium">
            <span className="text-[#475569]">Progress to $5 Gift Card</span>
            <span className="text-[#475569]">
              {points}/{targetPoints}
            </span>
          </div>

          <div className="w-full bg-[#e5e7eb] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#a800ff] h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#475569]">
          <div className="text-[12px]">🚀</div>
          <p className="text-[11.5px] font-medium opacity-90">
            {streakHistoryLength < 10
              ? "Just getting started — keep earning points!"
              : "Great start! Keep your streak going tomorrow!"}
          </p>
        </div>
      </div>
    </div>
  );
}

const GoldenStarCoin = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ perspective: "1000px" }}
    >
      <defs>
        <linearGradient
          id="coinGradient"
          x1="32"
          y1="0"
          x2="32"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFDB4D" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>

        <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="0" dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="SourceAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#coinGradient)"
        stroke="#FFE580"
        strokeWidth="4"
      />
      <path
        filter="url(#starShadow)"
        d="M32 15L37.1026 25.3388L48.514 27.0001L40.257 35.0487L42.2051 46.3999L32 41.035L21.7949 46.3999L23.743 35.0487L15.486 27.0001L26.8974 25.3388L32 15Z"
        fill="#ff8c00"
      />
    </svg>
  );
};

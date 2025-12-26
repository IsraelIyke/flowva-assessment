import { LuLibrary, LuGift, LuBanknote, LuGamepad2 } from "react-icons/lu";
import { FaPaypal, FaStar } from "react-icons/fa";
import { ReactNode, useState } from "react";

export default function RedeemRewards() {
  const [activeTab, setActiveTab] = useState("All Rewards");

  const tabs = [
    { label: "All Rewards", count: 8 },
    { label: "Unlocked", count: 0 },
    { label: "Locked", count: 7 },
    { label: "Coming Soon", count: 1 },
  ];

  const rewards = [
    {
      title: "$5 Bank Transfer",
      desc: "The $5 equivalent will be transferred to your bank account.",
      points: 5000,
      stat: "Locked",
      icon: "💸",
      category: "Locked", // Added category for filtering
    },
    {
      title: "$5 PayPal International",
      desc: "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
      points: 5000,
      stat: "Unlocked",
      icon: "💸",
      category: "UnLocked",
    },
    {
      title: "$5 Virtual Visa Card",
      desc: "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
      points: 5000,
      stat: "Locked",
      icon: "🎁",
      category: "Locked",
    },
    {
      title: "$5 Apple Gift Card",
      desc: "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more.",
      points: 5000,
      stat: "Locked",
      icon: "🎁",
      category: "Locked",
    },
    {
      title: "$5 Google Play Card",
      desc: "Use this $5 Google Play Card to purchase apps, games, movies, books, and more.",
      points: 5000,
      stat: "Locked",
      icon: "🎁",
      category: "Locked",
    },
    {
      title: "$5 Amazon Gift Card",
      desc: "Get a $5 digital gift card to spend on your favorite tools or platforms.",
      points: 5000,
      stat: "Locked",
      icon: "🎁",
      category: "Locked",
    },
    {
      title: "$10 Amazon Gift Card",
      desc: "Get a $10 digital gift card to spend on your favorite tools or platforms.",
      points: 10000,
      stat: "Locked",
      icon: "🎁",
      category: "Locked",
    },
    {
      title: "Free Udemy Course",
      desc: "Coming Soon!",
      points: 0,
      stat: "Coming Soon",
      icon: "📚",
      category: "Coming Soon",
    },
  ];

  // Filter rewards based on active tab
  const filteredRewards = rewards.filter((reward) => {
    if (activeTab === "All Rewards") return true;
    if (activeTab === "Unlocked") return reward.stat === "Unlocked";
    if (activeTab === "Locked") return reward.stat === "Locked";
    if (activeTab === "Coming Soon") return reward.stat === "Coming Soon";
    return true;
  });

  // Update tab counts based on actual data (optional improvement)
  const updatedTabs = tabs.map((tab) => {
    let count = 0;
    if (tab.label === "All Rewards") {
      count = rewards.length;
    } else if (tab.label === "Unlocked") {
      count = rewards.filter((r) => r.stat === "Unlocked").length;
    } else if (tab.label === "Locked") {
      count = rewards.filter((r) => r.stat === "Locked").length;
    } else if (tab.label === "Coming Soon") {
      count = rewards.filter((r) => r.stat === "Coming Soon").length;
    }
    return { ...tab, count };
  });

  return (
    <div className="w-full mx-auto font-sans bg-white min-h-screen">
      <h2 className="text-[28px] font-bold text-slate-800 mb-8">
        Redeem Your Points
      </h2>

      {/* --- Tabs --- */}
      <div className="flex flex-wrap gap-4 mb-10">
        {updatedTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`p-2.5 pb-2 font-medium rounded-t-md text-[15px]  transition-all duration-800 ease-in-out 
              ${
                activeTab === tab.label
                  ? "text-purple-600 border-b-3 border-purple-600 bg-purple-100"
                  : "text-gray-500  border-b-3 border-transparent hover:bg-purple-100"
              }`}
          >
            {tab.label}{" "}
            <span
              className={`ml-1 opacity-70 py-0 px-1.5 rounded-full text-[12px] font-semibold
                 ${activeTab === tab.label ? "bg-purple-300" : "bg-gray-300"}
                `}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* --- Reward Cards Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRewards.map((reward, index) => (
          <RewardCard key={index} {...reward} />
        ))}
      </div>

      {/* Show message when no rewards match the filter */}
      {filteredRewards.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No rewards found in this category.
        </div>
      )}
    </div>
  );
}

interface RewardCardProps {
  title: string;
  desc: string;
  points: number;
  stat: string;
  icon: ReactNode;
}

function RewardCard({ title, desc, points, stat, icon }: RewardCardProps) {
  const isComingSoon = stat === "Coming Soon";
  const isUnlocked = stat === "Unlocked";

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-mt-0.5 hover:mb-0.5">
      {/* Icon Box */}
      <div className="w-12 h-12 rounded-xl bg-[#f3e2ff]  flex items-center justify-center text-[#a800ff] text-2xl mb-4">
        {icon}
      </div>

      <h3 className="text-[17px] font-semibold text-gray-500 mb-1 leading-tight min-h-[42px] flex items-center">
        {title}
      </h3>

      <p className="text-gray-500 text-[13px] leading-relaxed flex-grow">
        {desc}
      </p>

      <div className="flex items-center gap-1.5 text-[#a800ff] font-semibold text-[15px] mb-4">
        <FaStar color="#FF9800" />
        <span>{points} pts</span>
      </div>

      {isUnlocked ? (
        <button className="w-full py-3.5 rounded-xl font-bold text-[15px] bg-[#a800ff] text-white">
          {stat}
        </button>
      ) : (
        <button
          disabled
          className={`w-full py-3.5 rounded-xl font-bold text-[15px] cursor-not-allowed 
          ${
            isComingSoon
              ? "bg-[#e2e8f0] text-slate-500"
              : isUnlocked
              ? "bg-[#a800ff] text-white"
              : "bg-[#dfe7f0] text-slate-400"
          }`}
        >
          {stat}
        </button>
      )}
    </div>
  );
}

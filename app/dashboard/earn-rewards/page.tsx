"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import PointsCard from "@/components/Rewards/PointsCard";
import StreakCard from "@/components/Rewards/StreakCard";
import SpotlightCard from "@/components/Rewards/SpotlightCard";
import EarnMoreCard from "@/components/Rewards/EarnMoreCard";
import ReferCard from "@/components/Rewards/ReferCard";
import RedeemRewards from "@/components/Rewards/RedeemRewards";
import { FaBell } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import NotificationCard from "@/components/Notifications";
import { useNotificationSubscription } from "@/hooks/useNotificationSubscription";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { useInitializeNotifications } from "@/hooks/useInitializeNotifications";
import Image from "next/image";

export default function RewardsPage() {
  const [tab, setTab] = useState<"earn" | "redeem">("earn");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // State to control the full-page loading screen
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Get notification store
  const { unreadCount, loading: notificationsLoading } =
    useNotificationsStore();

  // Initialize notifications
  useInitializeNotifications();
  useNotificationSubscription();

  const notificationRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  // Simulated Loading Delay (or use your actual data loading status)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000); // Shows for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
  const closeNotification = () => setIsNotificationOpen(false);

  // --- LOADING SCREEN UI ---
  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <Image
            src="/logo/flowva_logo.png"
            alt="logo"
            width={300}
            height={300}
          />
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        toggleSidebar={toggleSidebar}
      />

      {/* Overlays */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      {isNotificationOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={closeNotification}
        />
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white px-4 lg:px-8 pt-4 lg:pt-10 pb-1 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <button onClick={toggleSidebar} className="lg:hidden">
                {isSidebarOpen ? <CgClose size={28} /> : <BiMenu size={35} />}
              </button>

              <div>
                <h1 className="text-2xl font-medium mb-1.5">Rewards Hub</h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Earn points, unlock rewards, and celebrate your progress!
                </p>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                ref={bellButtonRef}
                onClick={toggleNotification}
                className={`relative flex justify-center items-center h-10 w-10 transition-all duration-200 rounded-full 
                  ${
                    isNotificationOpen
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-200"
                  }`}
              >
                <FaBell className="text-l" />
                {!notificationsLoading && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-40">
                  <NotificationCard />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="p-4 lg:p-8 pt-2 lg:pt-6 flex-1 overflow-y-auto scrollbar-hide">
          <div className="flex gap-6 mt-1 mb-8">
            <button
              onClick={() => setTab("earn")}
              className={`p-2.5 pb-2 font-medium rounded-t-md text-[15px] transition-all duration-800 ease-in-out ${
                tab === "earn"
                  ? "text-purple-600 border-b-3 border-purple-600 bg-purple-100"
                  : "text-gray-500  border-b-3 border-transparent hover:bg-purple-100"
              }`}
            >
              Earn Points
            </button>
            <button
              onClick={() => setTab("redeem")}
              className={`p-2.5 pb-2 font-medium rounded-t-md text-[15px] transition-all duration-800 ease-in-out  ${
                tab === "redeem"
                  ? "text-purple-600 border-b-3 border-purple-600 bg-purple-100"
                  : "text-gray-500  border-b-3 border-transparent hover:bg-purple-100"
              }`}
            >
              Redeem Rewards
            </button>
          </div>

          {tab === "earn" ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.25 h-9 bg-[#a800ff] rounded-full" />
                <h2 className="text-[25px] font-semibold">
                  Your Rewards Journey
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PointsCard />
                <StreakCard />
                <SpotlightCard />
              </div>
              <div className="mt-4 grid grid-cols-1">
                <EarnMoreCard />
                <ReferCard />
              </div>
            </>
          ) : (
            <RedeemRewards />
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MdHome, MdExplore } from "react-icons/md";
import { FaGem, FaBoxOpen, FaCreditCard } from "react-icons/fa6";
import { BsStack } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

const menuItems = [
  { name: "Home", icon: <MdHome className="text-2xl " />, href: "#" },
  { name: "Discover", icon: <MdExplore className="text-xl" />, href: "#" },
  { name: "Library", icon: <FaBoxOpen className="text-xl" />, href: "#" },
  { name: "Tech Stack", icon: <BsStack className="text-xl" />, href: "#" },
  {
    name: "Subscriptions",
    icon: <FaCreditCard className="text-xl" />,
    href: "#",
  },
  {
    name: "Rewards Hub",
    icon: <FaGem className="text-l" />,
    href: "/dashboard/earn-rewards",
  },
  {
    name: "Settings",
    icon: <RiUserSettingsFill className="text-xl -ml-1" />,
    href: "#",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  toggleSidebar?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get user data from Supabase
  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setUserName(user.user_metadata?.name || user.email.split("@")[0]);
      }
    };
    getUserData();
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showLogoutPopup &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogoutPopup]);

  // Close popup when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showLogoutPopup) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showLogoutPopup]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    onClose();
  };

  const toggleLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  const getUserInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Sidebar Container with Animation */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-screen
          bg-white border-r
          p-1 overflow-y-hidden overflow-x-hidden
          flex flex-col shadow-md border-black/10 text-black font-sans
          z-45 md:z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-58
        `}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <div className="relative w-6 h-6">
            <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-700 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gray-700 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
          </div>
        </button>

        <div className="text-2xl font-bold text-purple-600 mb-2 p-2 px-7 my-2 flex justify-start">
          <Image
            src="/logo/flowva_logo.png"
            height={200}
            width={600}
            alt="Flowva Logo"
            className="h-15 w-38"
          />
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`transition-all duration-300 ease-out flex items-center gap-3 px-4 py-3 mx-3 rounded-lg  ${
                item.name === "Rewards Hub"
                  ? "bg-purple-200 text-purple-600 font-medium"
                  : "hover:bg-purple-100 hover:text-purple-600"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Section - Clickable */}
        <div className="mt-auto border-t" ref={profileRef}>
          <div
            onClick={toggleLogoutPopup}
            className="flex items-center gap-3 p-3 px-4 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors group relative"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center font-semibold text-purple-600 group-hover:scale-105 transition-transform">
              {getUserInitial()}
            </div>
            <div className="text-sm flex-1">
              <p className="font-medium text-gray-800">{userName}</p>
              <p className="text-gray-500 text-xs truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Popup */}
        {showLogoutPopup && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setShowLogoutPopup(false)}
            />

            {/* Popup positioned relative to sidebar on desktop, centered on mobile */}
            <div
              ref={popupRef}
              className={`
                fixed lg:absolute 
                bottom-24 lg:bottom-20
                left-1/2 lg:left-4
                transform -translate-x-1/2 lg:translate-x-0
                w-[calc(100vw-2rem)] lg:w-50
                max-w-sm
                bg-white rounded-2xl shadow-2xl border border-gray-100
                p-6
                z-50
                animate-in fade-in zoom-in duration-200
              `}
            >
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="w-full bg-gray-100 text-gray-800 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Feedback
                </button>
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="w-full bg-gray-100 text-gray-800 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Support
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-linear-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  <FiLogOut className="text-lg" />
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Mobile backdrop for logout popup */}
      {showLogoutPopup && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setShowLogoutPopup(false)}
        />
      )}
    </>
  );
}

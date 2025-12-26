"use client";

import React, { useEffect, useState, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { LuFlame, LuSmile, LuInfo, LuTrophy, LuMailOpen } from "react-icons/lu";
import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import {
  useNotificationsStore,
  Notification,
} from "@/stores/notificationsStore";
import { supabase } from "@/lib/supabase";

// Format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Get icon based on notification type
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "streak":
      return <LuFlame size={15} />;
    case "welcome":
      return <LuSmile size={15} />;
    case "achievement":
      return <LuTrophy size={15} />;
    default:
      return <LuInfo size={15} />;
  }
};

// Get icon background color
const getIconBgColor = (type: Notification["type"], isRead: boolean) => {
  const baseClasses =
    "w-8 h-8 rounded-full flex items-center justify-center shrink-0";

  if (isRead) {
    return `${baseClasses} bg-gray-100 text-gray-400`;
  }

  switch (type) {
    case "streak":
      return `${baseClasses} bg-[#ffedda] text-[#ff8a00]`;
    case "welcome":
      return `${baseClasses} bg-[#e6f9ef] text-[#22c55e]`;
    case "achievement":
      return `${baseClasses} bg-[#eef2ff] text-[#4f46e5]`;
    default:
      return `${baseClasses} bg-[#f0f4ff] text-[#6366f1]`;
  }
};

export default function NotificationCard() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteAllNotifications,
    setSelectedNotification,
    selectedNotification,
    showDeleteWarning,
    setShowDeleteWarning,
    getVisibleNotifications,
  } = useNotificationsStore();

  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const messagePopupRef = useRef<HTMLDivElement>(null);

  // Function to delete a single notification
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get current state
      const currentNotifications = [...notifications];
      const updatedNotifications = currentNotifications.filter(
        (n) => n.id !== notificationId
      );

      // Update local state
      useNotificationsStore.setState({
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.is_read).length,
      });

      // Update in database
      const { data: currentData } = await supabase
        .from("notificationsandreferral")
        .select("notifications")
        .eq("user_id", user.id)
        .single();

      if (currentData) {
        const updatedJson = (currentData.notifications || []).filter(
          (n: Notification) => n.id !== notificationId
        );

        await supabase
          .from("notificationsandreferral")
          .update({ notifications: updatedJson })
          .eq("user_id", user.id);
      }

      // Close options menu
      setShowOptionsMenu(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Refresh notifications to sync state
      fetchNotifications();
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close message popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedNotification &&
        messagePopupRef.current &&
        !messagePopupRef.current.contains(event.target as Node)
      ) {
        setSelectedNotification(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedNotification, setSelectedNotification]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setShowOptionsMenu(null);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setShowOptionsMenu(null);
  };

  const handleDeleteAll = () => {
    setShowDeleteWarning(true);
    setShowOptionsMenu(null);
  };

  const confirmDeleteAll = () => {
    deleteAllNotifications();
    setShowDeleteWarning(false);
  };

  const cancelDeleteAll = () => {
    setShowDeleteWarning(false);
  };

  const visibleNotifications = getVisibleNotifications();

  // Loading State
  if (loading && notifications.length === 0) {
    return (
      <div className="absolute right-0 w-95 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-100">
        <div className="bg-linear-to-r from-[#a800ff] to-[#ff5db1] p-5 px-6">
          <h3 className="text-white text-l font-bold">Notifications</h3>
        </div>
        <div className="p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute right-0 w-80 md:w-95 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
        {/* Header with linear */}
        <div className="bg-linear-to-r from-[#a800ff] to-[#ff5db1] p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-white text-l font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-white text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`text-white/90 text-[11px] font-medium hover:text-white transition-colors ${
                unreadCount === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Mark all as read
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={visibleNotifications.length === 0}
              className={`text-white/90 text-[11px] font-medium hover:text-white transition-colors ${
                visibleNotifications.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-100 overflow-y-auto">
          {visibleNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                <LuSmile size={32} />
              </div>
              <h4 className="font-medium text-gray-700 mb-1">
                No notifications
              </h4>
              <p className="text-gray-500 text-sm">You're all caught up!</p>
            </div>
          ) : (
            visibleNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-5 py-3 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative group
                  ${
                    index !== visibleNotifications.length - 1
                      ? "border-l-2 border-[#a800ff]"
                      : ""
                  }
                  ${
                    notification.is_read
                      ? "opacity-80 border-l-2 border-transparent"
                      : ""
                  }
                `}
              >
                {/* Icon Container */}
                <div
                  className={getIconBgColor(
                    notification.type,
                    notification.is_read
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-bold text-[13px] leading-tight ${
                        notification.is_read
                          ? "text-gray-600"
                          : "text-[#334155]"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] leading-snug line-clamp-1 ${
                      notification.is_read ? "text-gray-500" : "text-slate-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <span className="text-slate-400 text-[10px] mt-2 block">
                    {formatTimeAgo(notification.created_at)}
                  </span>
                </div>

                {/* Options Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptionsMenu(
                      showOptionsMenu === notification.id.toString()
                        ? null
                        : notification.id.toString()
                    );
                  }}
                  className="absolute right-4 bottom-4 text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineDotsHorizontal size={16} />
                </button>

                {/* Options Menu */}
                {showOptionsMenu === notification.id.toString() && (
                  <div
                    ref={optionsMenuRef}
                    className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border border-gray-200 w-32 z-10"
                  >
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                          setShowOptionsMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Full Message Popup */}
      {selectedNotification && (
        <>
          <div className="fixed inset-0 border-4 bg-black/60 z-60 backdrop-blur-sm animate-in fade-in duration-300" />

          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              ref={messagePopupRef}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200"
            >
              {/* Popup Header */}
              <div className="p-5 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={getIconBgColor(
                      selectedNotification.type,
                      selectedNotification.is_read
                    )}
                  >
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="text-black text-l font-bold">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatTimeAgo(selectedNotification.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-black hover:text-black/80"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Popup Body */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {selectedNotification.full_message ||
                      selectedNotification.message}
                  </p>
                </div>

                {/* Metadata Display */}
                {selectedNotification.metadata &&
                  Object.keys(selectedNotification.metadata).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Details:</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {Object.entries(selectedNotification.metadata).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center text-xs mb-1 last:mb-0"
                            >
                              <span className="font-medium text-gray-600 mr-2 capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>
                              <span className="text-gray-700">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete All Warning Popup */}
      {showDeleteWarning && (
        <>
          <div className="fixed inset-0 bg-black/50 z-65 backdrop-blur-sm animate-in fade-in duration-200" />

          <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-200">
              {/* Warning Header */}
              <div className="bg-linear-to-r from-red-500 to-red-600 p-5 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FiAlertTriangle className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">
                      Delete All Notifications?
                    </h3>
                    <p className="text-white/90 text-sm">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Body */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="text-red-500 mt-0.5">
                    <FiTrash2 size={18} />
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">
                      Are you sure you want to delete all notifications? This
                      will permanently remove {notifications.length}{" "}
                      notification(s).
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-xs">
                    <strong>Note:</strong> This action cannot be reversed. You
                    will lose all notification history.
                  </p>
                </div>
              </div>

              {/* Warning Footer */}
              <div className="border-t border-gray-100 p-4 flex justify-end gap-3">
                <button
                  onClick={cancelDeleteAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAll}
                  className="px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

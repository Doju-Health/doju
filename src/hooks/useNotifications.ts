import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: any;
  created_at: string;
}

// Mock notifications storage
const mockNotifications: Record<string, Notification[]> = {};

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const userNotifications = mockNotifications[user.id] || [];
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      if (!user) return;

      const userNotifications = mockNotifications[user.id] || [];
      const notif = userNotifications.find((n) => n.id === notificationId);
      if (notif) {
        notif.read = true;
        setNotifications([...userNotifications]);
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const userNotifications = mockNotifications[user.id] || [];
      userNotifications.forEach((n) => (n.read = true));
      setNotifications([...userNotifications]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  };
};

// Admin utility to send notifications
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  data?: any,
) => {
  try {
    if (!mockNotifications[userId]) {
      mockNotifications[userId] = [];
    }

    mockNotifications[userId].push({
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      type,
      data: data || null,
      read: false,
      created_at: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

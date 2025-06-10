import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification } from "@/types/notification";

// TYPE
type NotificationContextType = {
  notifications: Notification[];
  refetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
};

// DEFAULT VALUE
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  refetchNotifications: async () => {},
  markAsRead: async () => {},
  deleteNotification: async () => {},
});

// HOOK
export const useNotificationContext = () => useContext(NotificationContext);

// PROVIDER
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null: belum tahu, true/false: sudah tahu

  // Cek apakah user login
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Ambil notifikasi
  const refetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await fetch(`/api/notifications/me`);
      if (!res.ok) throw new Error("Gagal fetch notifikasi");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error saat fetch notifikasi:", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error("Gagal update is_read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/delete`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Gagal hapus notifikasi:", error);
    }
  };

  // Saat pertama kali render: cek auth, lalu fetch notif jika login
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refetchNotifications();
    } else {
      setNotifications([]); // Kosongkan kalau guest
    }
  }, [isAuthenticated]);

  return <NotificationContext.Provider value={{ notifications, refetchNotifications, markAsRead, deleteNotification }}>{children}</NotificationContext.Provider>;
};

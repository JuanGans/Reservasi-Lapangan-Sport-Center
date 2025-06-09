import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifikasi } from "@/context/NotifikasiContext";
import { useUser } from "@/context/userContext";
import { Notification } from "@/types/notification";
import { icons } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale"; // jika mau pakai Bahasa Indonesia

const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { showNotif } = useNotifikasi();

  // === STATE ===
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // === HANDLE CLICK OUTSIDE DROPDOWN & NOTIFIKASI ===
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // === API NOTIFIKASI ===
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/me`);
        if (!res.ok) throw new Error("Gagal mengambil notifikasi");

        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Fetch notif error:", error);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // TANDAI SUDAH DIBACA
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    } catch (error) {
      console.error("Gagal update is_read:", error);
    }
  };

  // DELETE NOTIFIKASI
  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus notifikasi");

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Gagal hapus notifikasi:", error);
    }
  };

  const handleShowNotifByType = (notif: Notification) => {
    switch (notif.type) {
      case "booking":
        showNotif({
          message: notif.message,
          type: "booking",
          actionLabel: "Lanjutkan ke Booking",
          onAction: () => router.push(`/member/booking/detail`),
        });
        break;

      case "payment":
        showNotif({
          message: notif.message,
          type: "payment",
          actionLabel: "Lanjutkan ke Pembayaran",
          onAction: () => router.push(`/member/booking/payment`),
        });
        break;

      case "confirmed":
        showNotif({
          message: notif.message,
          type: "confirmed",
          actionLabel: "Batalkan Booking",
          onAction: () => router.push(""),
        });
        break;

      case "review":
        showNotif({
          message: notif.message,
          type: "review",
          actionLabel: "Beri Ulasan",
          onAction: () => router.push(""),
        });
        break;

      default:
        showNotif({
          message: notif.message,
          type: notif.type,
        });
    }
  };

  // === LOGOUT FUNCTION ===
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await fetch("/api/auth/logout");
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      window.location.href = "/?logout=1";
    }
  };

  // === RENDER ===
  return (
    <header className="w-full flex justify-end items-center px-4 sm:px-6 py-3 fixed h-20 bg-white z-[20] shadow-sm border-b overflow-visible">
      {/* Kanan: Notifikasi + User */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* === NOTIFIKASI ICON === */}
        <div className="relative" ref={notifRef}>
          <button aria-label="Messages" onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
            <i className="fas fa-envelope text-lg sm:text-xl" />
            {notifications.filter((n) => !n.is_read).length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5">{notifications.filter((n) => !n.is_read).length}</span>}
          </button>

          {/* === DROPDOWN NOTIFIKASI === */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-2 mt-2 w-[60vw] max-w-sm sm:w-80 bg-white rounded-md shadow-lg z-10 py-2 border border-gray-200"
              >
                <h4 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifikasi</h4>
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500 italic text-blue-900">Tidak ada notifikasi.</p>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className={`px-4 py-3 flex justify-between items-start gap-3 cursor-pointer transition-all ${notif.is_read ? "bg-gray-50 text-gray-400" : "hover:bg-blue-50 text-blue-900"}`}
                        onClick={async () => {
                          await markAsRead(notif.id);
                          setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)));
                          handleShowNotifByType(notif);
                        }}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="mt-1">
                            <i className={icons[notif.type] || "fas fa-bell text-gray-400"} />
                          </div>
                          <div>
                            <p className="sm:text-sm text-xs">{notif.message}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}</p>
                          </div>
                        </div>

                        {/* MENGHAPUS NOTIFIKASI */}
                        {["info", "confirmed", "canceled", "completed"].includes(notif.type) && (
                          <button
                            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                          >
                            <i className="fas fa-times text-xs" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === USER DROPDOWN === */}
        <div className="relative" ref={dropdownRef}>
          <button className="flex items-center space-x-2 group cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-expanded={isDropdownOpen} aria-haspopup="true">
            {user?.user_img ? <img alt="User" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200" src={`/assets/user/${user.user_img}`} /> : <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />}
            <div className="text-right hidden sm:block">
              {user?.username ? <p className="text-xs font-semibold text-gray-900 leading-tight">{user.username}</p> : <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />}
              {user?.role ? <p className="text-[10px] text-gray-500 leading-tight">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p> : <div className="h-2 w-14 bg-gray-100 rounded animate-pulse" />}
            </div>

            <svg className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-2 mt-2 w-30 sm:w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 origin-top"
              >
                <Link href="/profile">
                  <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="mr-2 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile
                  </div>
                </Link>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  type="button"
                  className={`flex w-full items-center px-4 py-2 text-sm cursor-pointer ${isLoggingOut ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-gray-100"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggingOut) {
                      handleLogout();
                    }
                  }}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Logout
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;

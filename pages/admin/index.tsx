import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import StatsCard from "@/components/admin/StatsCard";
import { useUser } from "@/context/UserContext";

// Tipe data
import { Booking } from "@/types/booking";
import { User } from "@/types/user";
import { Facility } from "@/types/facility";
import { Review } from "@/types/review";
import { Transaction } from "@/types/transaction";
import { Notification } from "@/types/notification";
import { BookingSession } from "@/types/session";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

const AdminDashboard = () => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useUser();

  // Semua data tabel
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Error handler query
  useEffect(() => {
    const { restricted, repeat } = router.query;
    if (restricted === "1") {
      setToast({ message: "Tidak dapat akses, anda bukan member!", type: "error" });
      router.replace(router.pathname);
    } else if (repeat === "1") {
      setToast({ message: "Logout dengan benar!", type: "error" });
      router.replace(router.pathname);
    }
  }, [router]);

  // Fetch semua data sekaligus
  useEffect(() => {
    async function fetchAllData() {
      try {
        const [
          bookingsRes,
          usersRes,
          facilitiesRes,
          sessionsRes,
          notificationsRes,
          reviewsRes,
          transactionsRes,
        ] = await Promise.all([
          fetch("/api/bookings/getAllBookings"),
          fetch("/api/users"),
          fetch("/api/facilities/getAllFacilities"),
          fetch("/api/sessions/getAllSessions"),
          fetch("/api/notifications/getAll"),
          fetch("/api/reviews/getAll"),
          fetch("/api/transactions/getAll"),
        ]);

        if (!bookingsRes.ok) throw new Error("Gagal load bookings");
        if (!usersRes.ok) throw new Error("Gagal load users");

        setBookings(await bookingsRes.json());
        setUsers(await usersRes.json());
        setFacilities(await facilitiesRes.json());
        setSessions(await sessionsRes.json());
        setNotifications(await notificationsRes.json());
        setReviews(await reviewsRes.json());
        setTransactions(await transactionsRes.json());
      } catch (err) {
        setToast({ message: `Gagal memuat data: ${err}`, type: "error" });
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard Admin">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
          <StatsCard label="Total Users" value={users.length} color="text-blue-700" />
          <StatsCard label="Total Bookings" value={bookings.length} color="text-green-600" />
          <StatsCard label="Total Facilities" value={facilities.length} color="text-yellow-600" />
          <StatsCard label="Total Sessions" value={sessions.length} color="text-purple-600" />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard label="Total Notifications" value={notifications.length} color="text-indigo-600" />
          <StatsCard label="Total Reviews" value={reviews.length} color="text-pink-600" />
          <StatsCard label="Total Transactions" value={transactions.length} color="text-red-600" />
        </section>

        <p className="text-sm text-gray-500">
          Data dimuat secara paralel dari semua tabel. Kamu bisa menambahkan tabel detail atau chart tambahan di bawah.
        </p>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;

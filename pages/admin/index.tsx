// pages/admin/dashboard.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import StatsCard from "@/components/admin/StatsCard";
import TopUsers from "@/components/admin/TopUsers";
import BookingsChart from "@/components/admin/BookingsChart";
import ResponsiveBookingView from "@/components/dashboard/ResponsiveBooking";
import { Booking } from "@/types/booking";
import { useUser } from "@/context/UserContext";
import { BookingStatus } from "@/types/booking";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

const AdminDashboard = () => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [chartData, setChartData] = useState<{ name: string; booking: number }[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus>("all");
  const user = useUser();

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

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings/getAllBookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setToast({ message: "Gagal memuat data booking", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const paidBookings = bookings.filter((b) => b.booking_status === "paid" || b.booking_status === "completed").length;
  const canceledBookings = bookings.filter((b) => b.booking_status === "canceled").length;
  const totalRevenue = bookings.filter((b) => b.booking_status === "paid" || b.booking_status === "completed").reduce((sum, b) => sum + b.total_price, 0);

  const userBookingCount: Record<string, number> = {};
  bookings.forEach((b) => {
    const uname = b.user?.username;
    if (uname) userBookingCount[uname] = (userBookingCount[uname] || 0) + 1;
  });

  const topUsers = Object.entries(userBookingCount)
    .map(([username, count]) => ({ username, bookings: count }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 3);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard Admin">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
          <StatsCard label="Total Booking" value={totalBookings} color="text-blue-700" />
          <StatsCard label="Booking Berhasil" value={paidBookings} color="text-green-600" />
          <StatsCard label="Dibatalkan" value={canceledBookings} color="text-red-600" />
          <StatsCard label="Pendapatan" value={`Rp. ${totalRevenue.toLocaleString()}`} color="text-yellow-600" />
        </section>

        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BookingsChart bookings={bookings} />
          <TopUsers users={topUsers} />
        </section>

        {/* Filter Status Booking */}
        <div className="my-6">
          <label className="mr-2 text-blue-900 font-semibold">Filter Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BookingStatus)} className="border border-gray-300 rounded-md p-2 text-gray-500 text-xs cursor-pointer">
            <option value="all">Semua</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="paid">Selesai Membayar</option>
            <option value="confirmed">Booking Sukses</option>
            <option value="canceled">Booking Ditolak</option>
            <option value="expired">Pembayaran Kadaluarsa</option>
            <option value="review">Menunggu Review</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Table</h2>
          <ResponsiveBookingView bookings={bookings} filterStatus={filterStatus} setFilterStatus={setFilterStatus} role={user?.user?.role ?? "member"} />
        </section>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;

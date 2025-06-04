import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import Toast from "@/components/toast/Toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type BookingStatus = "all" | "pending" | "paid" | "canceled" | "completed";

interface Booking {
  id: number;
  user: string;
  status: BookingStatus;
  total: number;
  date: string; // ISO string
  duration: number; // hours
  field: string;
}

interface UserStats {
  username: string;
  bookings: number;
}

interface Activity {
  id: number;
  message: string;
  timeAgo: string;
}

interface FieldStatus {
  field: string;
  status: "available" | "used" | "soon";
}

const AdminDashboard: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { restricted, repeat } = router.query;
    if (restricted === "1") {
      setToast({ message: "Tidak dapat akses, anda bukan admin!", type: "error" });
      router.replace(router.pathname);
    } else if (repeat === "1") {
      setToast({ message: "Logout dengan benar!", type: "error" });
      router.replace(router.pathname);
    }
  }, [router]);

  // Fetch booking data (dummy API simulation)
  useEffect(() => {
    async function fetchBookings() {
      // Simulasi fetch API
      // Ganti dengan fetch("/api/bookings/getAllBookings")
      const dummyBookings: Booking[] = [
        { id: 1, user: "Budi", status: "paid", total: 150000, date: "2025-05-20T10:00:00Z", duration: 2, field: "Lapangan A" },
        { id: 2, user: "Sari", status: "pending", total: 100000, date: "2025-05-21T14:00:00Z", duration: 1, field: "Lapangan B" },
        { id: 3, user: "Andi", status: "canceled", total: 120000, date: "2025-05-19T16:00:00Z", duration: 2, field: "Lapangan A" },
        { id: 4, user: "Budi", status: "paid", total: 200000, date: "2025-05-22T18:00:00Z", duration: 3, field: "Lapangan C" },
        { id: 5, user: "Rina", status: "paid", total: 100000, date: "2025-05-20T09:00:00Z", duration: 1, field: "Lapangan A" },
      ];
      setBookings(dummyBookings);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  // Stats calculation
  const totalBookings = bookings.length;
  const paidBookings = bookings.filter((b) => b.status === "paid").length;
  const canceledBookings = bookings.filter((b) => b.status === "canceled").length;
  const totalRevenue = bookings.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.total, 0);

  // Booking today count
  const today = new Date().toISOString().slice(0, 10);
  const bookingsToday = bookings.filter((b) => b.date.startsWith(today)).length;

  // Average duration
  const avgDuration = bookings.length > 0 ? (bookings.reduce((sum, b) => sum + b.duration, 0) / bookings.length).toFixed(1) : "0";

  // Top users
  const userBookingCount: Record<string, number> = {};
  bookings.forEach((b) => {
    userBookingCount[b.user] = (userBookingCount[b.user] || 0) + 1;
  });
  const topUsers: UserStats[] = Object.entries(userBookingCount)
    .map(([username, count]) => ({ username, bookings: count }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 3);

  // Recent activities dummy data
  const recentActivities: Activity[] = [
    { id: 1, message: "Booking baru oleh Budi di Lapangan A", timeAgo: "1 jam lalu" },
    { id: 2, message: "Pembatalan booking Andi", timeAgo: "2 jam lalu" },
    { id: 3, message: "Pembayaran berhasil dari Sari", timeAgo: "5 jam lalu" },
  ];

  // Field status dummy
  const fieldStatuses: FieldStatus[] = [
    { field: "Lapangan A", status: "used" },
    { field: "Lapangan B", status: "available" },
    { field: "Lapangan C", status: "soon" },
  ];

  // Chart dummy data for last 6 months
  const chartData = [
    { name: "Jan", booking: 30 },
    { name: "Feb", booking: 45 },
    { name: "Mar", booking: 60 },
    { name: "Apr", booking: 50 },
    { name: "Mei", booking: 70 },
    { name: "Jun", booking: 40 },
  ];

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard Admin">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Total Booking</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{totalBookings}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Booking Berhasil</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{paidBookings}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Dibatalkan</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{canceledBookings}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Pendapatan</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">Rp. {totalRevenue.toLocaleString()}</p>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-5 col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistik Booking per Bulan</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="booking" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Pengguna Aktif</h2>
            <ul className="text-gray-700">
              {topUsers.map((user, idx) => (
                <li key={idx} className="flex justify-between py-2 border-b border-gray-200">
                  <span>{user.username}</span>
                  <span className="font-semibold">{user.bookings}x booking</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
            <ul className="text-gray-700 space-y-3">
              {recentActivities.map((act) => (
                <li key={act.id} className="flex justify-between border-b border-gray-200 pb-2">
                  <span>{act.message}</span>
                  <span className="text-xs text-gray-400">{act.timeAgo}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Lapangan</h2>
            <ul className="text-gray-700">
              {fieldStatuses.map((f, idx) => {
                let statusColor = "";
                if (f.status === "available") statusColor = "text-green-600";
                else if (f.status === "used") statusColor = "text-red-600";
                else if (f.status === "soon") statusColor = "text-yellow-600";

                return (
                  <li key={idx} className="flex justify-between py-2 border-b border-gray-200">
                    <span>{f.field}</span>
                    <span className={`font-semibold ${statusColor}`}>{f.status === "available" ? "Tersedia" : f.status === "used" ? "Sedang Digunakan" : "Booking Sebentar Lagi"}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section> */}

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Table</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Lapangan</th>
                  <th className="py-3 px-6">Tanggal</th>
                  <th className="py-3 px-6">Sesi (Jam)</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-200 hover:bg-gray-50 text-gray-600">
                    <td className="py-3 px-6">{b.id}</td>
                    <td className="py-3 px-6">{b.user}</td>
                    <td className="py-3 px-6">{b.field}</td>
                    <td className="py-3 px-6">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="py-3 px-6">{b.duration}</td>
                    <td className={`py-3 px-6 font-semibold ${b.status === "paid" ? "text-green-600" : b.status === "pending" ? "text-yellow-600" : b.status === "canceled" ? "text-red-600" : "text-gray-600"}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </td>
                    <td className="py-3 px-6">Rp {b.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;

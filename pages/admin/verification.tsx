import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";

interface Booking {
  id: number;
  user: {
    name: string;
  };
  facility: {
    field_name: string;
  };
  date: string;
  sessions: {
    start_time: string;
  }[];
  duration: number;
  status: string;
  total_price: number;
}

const AdminListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/getAllBookings");
        if (!res.ok) throw new Error("Gagal mengambil data booking");
        const data = await res.json();
        setBookings(data);
      } catch (error: any) {
        setToast({ message: error.message || "Terjadi kesalahan", type: "error" });
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Data Booking Lapangan">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Data Reservasi Lapangan</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
          <table className="min-w-full table-auto border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Nama User</th>
                <th className="px-4 py-2 border">Nama Lapangan</th>
                <th className="px-4 py-2 border">Tanggal Booking</th>
                <th className="px-4 py-2 border">Sesi</th>
                <th className="px-4 py-2 border">Durasi (Jam)</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={booking.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{booking.user?.name || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.facility?.field_name || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.date}</td>
                    <td className="px-4 py-2 border">{booking.sessions.map((s) => s.start_time).join(", ")}</td>
                    <td className="px-4 py-2 border">{booking.duration}</td>
                    <td className="px-4 py-2 border">{booking.status}</td>
                    <td className="px-4 py-2 border">Rp {booking.total_price.toLocaleString("id-ID")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminListPage;

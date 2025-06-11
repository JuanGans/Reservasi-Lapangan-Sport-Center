import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import DetailModal from "@/components/booking/admin/BookingVerificationModal";
import { motion, AnimatePresence } from "framer-motion";
import { Booking } from "@/types/booking";

const AdminListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/getAllBookings");
        if (!res.ok) throw new Error("Gagal mengambil data booking");
        const data = await res.json();
        const filtered = data.filter((b: Booking) => b.booking_status === "paid");
        setBookings(filtered);
      } catch (error: any) {
        setToast({ message: error.message || "Terjadi kesalahan", type: "error" });
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {selectedBooking && (
        <DetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={(msg) => {
            setToast({ message: msg, type: "success" });
            setSelectedBooking(null);
          }}
          onError={(msg) => {
            setToast({ message: msg, type: "error" });
          }}
        />
      )}

      <DashboardLayout title="Verifikasi Booking">
        <motion.h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 mt-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Daftar Booking Menunggu Verifikasi
        </motion.h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 font-semibold text-left">
              <tr>
                <th className="px-4 py-3 border">No</th>
                <th className="px-4 py-3 border">Nama User</th>
                <th className="px-4 py-3 border">Lapangan</th>
                <th className="px-4 py-3 border">Tanggal</th>
                <th className="px-4 py-3 border">Sesi</th>
                <th className="px-4 py-3 border">Durasi</th>
                <th className="px-4 py-3 border">Total</th>
                <th className="px-4 py-3 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-400">
                    Tidak ada data booking yang menunggu verifikasi
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <motion.tr key={booking.id} className="border-t hover:bg-gray-50 text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <td className="px-4 py-3 border">{index + 1}</td>
                    <td className="px-4 py-3 border font-medium">{booking.user?.username}</td>
                    <td className="px-4 py-3 border">{booking.facility?.field_name}</td>
                    <td className="px-4 py-3 border">{new Date(booking.booking_date).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3 border">{booking.sessions?.map((s) => s.session_label).join(", ")}</td>
                    <td className="px-4 py-3 border">{booking.sessions?.length} jam</td>
                    <td className="px-4 py-3 border">Rp. {booking.total_price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 border">
                      <button onClick={() => setSelectedBooking(booking)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm cursor-pointer">
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-5">
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
              >
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400">Nama User</p>
                    <p className="text-base font-semibold text-blue-900">{booking.user?.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lapangan</p>
                    <p className="text-gray-700">{booking.facility?.field_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tanggal</p>
                    <p className="text-gray-700">{booking.booking_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sesi</p>
                    <p className="text-gray-700">{booking.sessions?.map((s) => s.session_label).join(", ")}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-bold text-blue-700 text-base">Rp. {booking.total_price.toLocaleString("id-ID")}</p>
                    </div>
                    <button onClick={() => setSelectedBooking(booking)} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm transition-all duration-200 shadow-sm">
                      Detail
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminListPage;

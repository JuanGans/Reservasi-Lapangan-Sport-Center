import React, { useEffect, useState } from "react";
import { Booking } from "@/types/booking";
import BookingDetailModal from "../booking/PopupBookingDetail";
import { BookingStatus } from "@/types/booking"; // pastikan import ini sesuai lokasi aslinya
import { AnimatePresence } from "framer-motion";

type BookingTableProps = {
  bookings: Booking[];
  filterStatus: BookingStatus;
  setFilterStatus: (status: BookingStatus) => void;
  role: string;
};

const BookingTable: React.FC<BookingTableProps> = ({ bookings, filterStatus, role }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = selectedBooking ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBooking]);

  const handleDetailClick = (id: number, index: number) => {
    const booking = bookings.find((b) => b.id === id) || null;
    setIndex(index);
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => setSelectedBooking(null);

  const filteredBookings = bookings.filter((booking) => (filterStatus === "all" ? true : booking.booking_status === filterStatus));

  const statusStyles: Record<Exclude<BookingStatus, "all">, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    canceled: "bg-red-100 text-red-700",
    expired: "bg-gray-200 text-gray-700",
    review: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Riwayat Booking</h2>

      <div className="min-w-[800px]">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="text-left text-gray-500">
            <tr className="bg-gray-50">
              <th className="px-3 py-2">No</th>
              {role === "admin" && <th className="px-3 py-2">Nama</th>}
              <th className="px-3 py-2">Lapangan</th>
              <th className="px-3 py-2">Tanggal</th>
              <th className="px-3 py-2">Sesi</th>
              <th className="px-3 py-2">Durasi</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Total</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-400">
                  Tidak ada booking ditemukan.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking, index) => {
                const durasi = booking.sessions?.reduce((total, session) => {
                  const start = new Date(session.start_time).getTime();
                  const end = new Date(session.end_time).getTime();
                  return total + (end - start) / (1000 * 60);
                }, 0);

                const durasiJam = durasi ? durasi / 60 : 0;

                return (
                  <tr key={booking.id} className="bg-white shadow-sm rounded-lg">
                    <td className="px-3 py-2 text-gray-700">{index + 1}</td>
                    {role === "admin" && <td className="px-3 py-2 text-gray-800">{booking.user?.username || "-"}</td>}
                    <td className="px-3 py-2 font-medium text-gray-800">{booking.facility?.field_name || "-"}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {new Date(booking.booking_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2 text-gray-700 space-y-1">{booking.sessions?.length ? booking.sessions.map((session) => <div key={session.id}>{session.session_label}</div>) : <span>-</span>}</td>
                    <td className="px-3 py-2 text-center text-gray-700 whitespace-nowrap">{durasiJam} Jam</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusStyles[booking.booking_status as Exclude<BookingStatus, "all">] || "bg-gray-100 text-gray-700"}`}>{booking.booking_status}</span>
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700">{booking.total_price !== undefined ? `Rp ${booking.total_price.toLocaleString("id-ID")}` : "-"}</td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => handleDetailClick(booking.id, index)} className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 transition-all duration-200 cursor-pointer">
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Modal Detail */}
        <AnimatePresence mode="wait">{selectedBooking && <BookingDetailModal key={index} booking={selectedBooking} index={index} role={role} onClose={handleCloseModal} />}</AnimatePresence>
      </div>
    </div>
  );
};

export default BookingTable;

import React from "react";
import { Booking } from "@/types/booking";

interface DetailModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ booking, onClose, onSuccess, onError }) => {
  const handleVerify = async () => {
    try {
      const res = await fetch(`/api/bookings/verify/${booking.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Gagal memverifikasi booking");
      onSuccess("Booking berhasil diverifikasi");
    } catch (err: any) {
      onError(err.message);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`/api/bookings/reject/${booking.id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Gagal menolak booking");
      onSuccess("Booking berhasil ditolak");
    } catch (err: any) {
      onError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Detail Booking</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Nama User:</strong> {booking.user?.username}
          </p>
          <p>
            <strong>Lapangan:</strong> {booking.facility?.field_name}
          </p>
          <p>
            <strong>Tanggal:</strong> {booking.booking_date}
          </p>
          <p>
            <strong>Sesi:</strong> {booking.sessions?.map((s) => s.session_label)}
          </p>
          <p>
            <strong>Durasi:</strong> {booking.sessions?.length} jam
          </p>
          <p>
            <strong>Status:</strong> {booking.booking_status}
          </p>
          <p>
            <strong>Total Harga:</strong> Rp. {booking.total_price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
            Tolak
          </button>
          <button onClick={handleVerify} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
            Verifikasi
          </button>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">
          ×
        </button>
      </div>
    </div>
  );
};

export default DetailModal;

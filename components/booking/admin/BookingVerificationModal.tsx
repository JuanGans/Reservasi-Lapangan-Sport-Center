import React from "react";
import { Booking } from "@/types/booking";
import { motion, AnimatePresence } from "framer-motion";

interface DetailModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariant = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

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
    <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" variants={backdropVariant} initial="hidden" animate="visible" exit="hidden">
      <motion.div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative" variants={modalVariant} initial="hidden" animate="visible" exit="exit">
        <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">Detail Booking</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-medium">Nama User</p>
            <p>{booking.user?.username}</p>
          </div>
          <div>
            <p className="font-medium">Lapangan</p>
            <p>{booking.facility?.field_name}</p>
          </div>
          <div>
            <p className="font-medium">Tanggal</p>
            <p>{booking.booking_date}</p>
          </div>
          <div>
            <p className="font-medium">Sesi</p>
            <p>{booking.sessions?.map((s) => s.session_label).join(", ")}</p>
          </div>
          <div>
            <p className="font-medium">Durasi</p>
            <p>{booking.sessions?.length} jam</p>
          </div>
          <div>
            <p className="font-medium">Total Harga</p>
            <p>Rp. {booking.total_price.toLocaleString("id-ID")}</p>
          </div>

          {booking.transaction?.payment_proof && (
            <div className="sm:col-span-2">
              <p className="font-medium mb-1">Bukti Pembayaran</p>
              <a href={booking.transaction.payment_proof} target="_blank" rel="noopener noreferrer">
                <img src={booking.transaction.payment_proof} alt="Bukti Pembayaran" className="w-full max-h-64 object-contain rounded-md border shadow-md hover:shadow-lg transition" />
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button onClick={handleReject} className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition cursor-pointer">
            Tolak
          </button>
          <button onClick={handleVerify} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition cursor-pointer">
            Verifikasi
          </button>
        </div>

        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-semibold">
          ×
        </button>
      </motion.div>
    </motion.div>
  );
};

export default DetailModal;

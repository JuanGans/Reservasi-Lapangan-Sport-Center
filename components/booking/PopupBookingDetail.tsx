import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Booking } from "@/types/booking";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

type Props = {
  booking: Booking | null;
  onClose: () => void;
};

const BookingDetailModal: React.FC<Props> = ({ booking, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!booking || booking.booking_status !== "pending") return;

    const tenggat = new Date(booking.created_at);
    tenggat.setMinutes(tenggat.getMinutes() + 15);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = tenggat.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Waktu habis");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  if (!booking) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative text-blue-900"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-2xl font-bold mb-4 border-b pb-3">Detail Booking #{booking.id}</h3>

          {/* Foto Lapangan */}
          {booking.facility?.field_image && <img src={`/assets/field/${booking.facility?.field_image}`} alt="Lapangan" className="w-full h-48 object-cover rounded-md mb-4" />}

          <div className="space-y-3 text-sm sm:text-base">
            <div>
              <strong>Fasilitas:</strong> {booking.facility?.field_name || "-"}
            </div>
            <div>
              <strong>Status:</strong> <span className={`font-medium ${booking.booking_status === "completed" ? "text-green-600" : booking.booking_status === "pending" ? "text-yellow-600" : "text-red-600"}`}>{booking.booking_status}</span>
            </div>
            <div>
              <strong>Tanggal:</strong>{" "}
              {new Date(booking.booking_date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div>
              <strong>Sesi:</strong> {booking.sessions?.map((s) => s.session_label).join(", ") || "-"}
            </div>
            <div>
              <strong>Total Bayar:</strong> <span className="font-semibold text-blue-700">Rp {booking.total_price.toLocaleString("id-ID")}</span>
            </div>

            {/* Tenggat waktu realtime */}
            {booking.booking_status === "pending" && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-300 mt-4">
                <p className="text-yellow-800 font-semibold">Tenggat Pembayaran:</p>
                <p className="text-yellow-700">{timeLeft}</p>
              </div>
            )}

            {/* Opsi pembayaran */}
            {booking.booking_status === "pending" && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md border">
                <p className="font-medium text-blue-700 mb-1">Metode Pembayaran:</p>
                <div className="flex items-center gap-3">
                  <img src="/bank-bca-logo.png" alt="BCA" className="w-10 h-10 object-contain" />
                  <div>
                    <p className="text-sm text-gray-800">
                      Transfer ke: <strong>1234567890</strong>
                    </p>
                    <p className="text-xs text-gray-500">a.n. PT Lapangan Sport</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tombol aksi */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={onClose} className="w-full sm:w-auto px-5 py-3 border border-gray-300 hover:bg-gray-100 rounded-md transition text-gray-700 font-medium cursor-pointer">
              Tutup
            </button>

            {booking.booking_status === "pending" && (
              <button onClick={() => alert("Lanjut ke pembayaran")} className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition cursor-pointer">
                Lanjut ke Pembayaran
              </button>
            )}

            {booking.booking_status === "paid" && (
              <button onClick={() => alert("Hubungi admin untuk pembatalan")} className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition cursor-pointer">
                Batal Booking
              </button>
            )}

            {booking.booking_status === "completed" && (
              <button onClick={() => alert("Arahkan ke halaman ulasan")} className="w-full sm:w-auto px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition cursor-pointer">
                Beri Ulasan
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingDetailModal;

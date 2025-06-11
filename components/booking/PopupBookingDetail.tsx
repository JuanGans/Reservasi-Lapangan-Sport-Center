import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Booking } from "@/types/booking";
import { useRouter } from "next/router";

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
  index: number;
  role: string;
};

const nomorRek = "123456789012345";
const noHP = "081249217968";
const namaPemilik = "PT. JTI Sport Center";

const BookingDetailModal: React.FC<Props> = ({ booking, onClose, index, role }) => {
  const [countdown, setCountdown] = useState(30 * 60);
  const router = useRouter();
  const isBank = booking?.transaction?.payment_method ? ["BNI", "BCA", "BRI", "Mandiri"].includes(booking?.transaction?.payment_method) : false;
  const [routing, setRouting] = useState("");

  useEffect(() => {
    if (booking) {
      if (!booking.transaction?.payment_method || !booking.transaction?.id) {
        setRouting("detail");
        localStorage.setItem("latestBookingId", booking.id.toString());
        localStorage.removeItem("latestTransactionId");
      } else {
        setRouting("payment");
        localStorage.setItem("latestBookingId", booking.id.toString());
        localStorage.setItem("latestTransactionId", booking.transaction.id.toString());
      }
    }
  }, [booking]);

  useEffect(() => {
    if (!booking || booking.booking_status !== "pending") return;

    const expiredAt = new Date(booking.expired_at).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime() + 7 * 60 * 60 * 1000;
      const diffInSeconds = Math.floor((expiredAt - now) / 1000);

      if (diffInSeconds <= 0) {
        clearInterval(interval);
        setCountdown(0);
        // Batalkan booking otomatis
        expiredBooking();
      } else {
        setCountdown(diffInSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.expired_at]);

  const expiredBooking = async () => {
    try {
      if (!booking) return;

      await fetch(`/api/bookings/expiredBooking/${booking.id}`, {
        method: "POST", // atau "PUT" tergantung API-mu
      });

      localStorage.removeItem("latestBookingId");
      localStorage.removeItem("latestTransactionId");

      // router.replace("/member?BookingExpired=1");
      return;
    } catch (err) {
      console.error("Gagal membatalkan booking:", err);
    }
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!booking) return null;

  const renderPendingInfo = () => (
    <>
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-300 mt-6 space-y-1">
        <p className="text-yellow-800 font-semibold text-sm">Tenggat Pembayaran:</p>
        <p className="text-yellow-700">{formatCountdown(countdown)}</p>
      </div>

      {booking.transaction?.id && (
        <div className="mt-8 bg-gray-50 p-4 rounded-xl border flex items-center gap-4">
          <img src={`/assets/payment/${booking.transaction.payment_method.toLowerCase()}.png`} alt={booking.transaction.payment_method} className="w-12 h-12 object-contain" />
          <div>
            <p className="text-sm text-gray-800">
              Metode yang dipilih: <strong>{booking.transaction.payment_method}</strong>
            </p>
            <p className="text-sm text-gray-800">
              Transfer ke:{" "}
              <strong>
                {isBank ? nomorRek : noHP} {isBank ? `(BRI)` : ""}
              </strong>
            </p>
            <p className="text-xs text-gray-500">{namaPemilik}</p>
          </div>
        </div>
      )}
    </>
  );

  const renderFooterButton = () => {
    switch (booking.booking_status) {
      case "pending":
        return (
          <button
            onClick={() => {
              localStorage.setItem("latestBookingId", booking.id.toString());
              if (routing == "payment" && booking.transaction?.id) {
                localStorage.setItem("latestTransactionId", booking.transaction.id.toString());
              }
              router.push(`/member/booking/${routing}`);
            }}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition w-full sm:w-auto cursor-pointer"
          >
            Lanjut ke Pembayaran
          </button>
        );
      // case "paid":
      //   return (
      //     <button onClick={() => alert("Hubungi admin untuk pembatalan")} className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition w-full sm:w-auto cursor-pointer">
      //       Batal Booking
      //     </button>
      //   );
      case "review":
        return (
          <button onClick={() => alert("Arahkan ke halaman ulasan")} className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition w-full sm:w-auto cursor-pointer">
            Beri Ulasan
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative text-blue-900 border border-gray-100"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 border-b pb-4 text-center text-blue-800">Detail Booking #{index + 1}</h3>

        {booking.facility?.field_image && <img src={`/assets/field/${booking.facility?.field_image}`} alt="Lapangan" className="w-full h-56 object-cover rounded-xl mb-6 shadow-sm" />}

        <div className="grid gap-4 text-sm sm:text-base">
          <DetailItem label="Fasilitas" value={booking.facility?.field_name || "-"} />
          <DetailItem label="Status" value={booking.booking_status} status />
          <DetailItem
            label="Tanggal"
            value={new Date(booking.booking_date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <DetailItem label="Sesi" value={booking.sessions?.map((s) => s.session_label).join(", ") || "-"} />
          <DetailItem label="Total Bayar" value={`Rp ${booking.total_price.toLocaleString("id-ID")}`} highlight />
        </div>

        {role === "member" && <>{booking.booking_status === "pending" && renderPendingInfo()}</>}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button onClick={onClose} className="px-5 py-3 border border-gray-300 hover:bg-gray-100 rounded-xl transition text-gray-700 font-medium w-full sm:w-auto cursor-pointer">
            Tutup
          </button>
          {role === "member" && <>{renderFooterButton()}</>}
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value, status = false, highlight = false }: { label: string; value: string; status?: boolean; highlight?: boolean }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="font-medium text-gray-600">{label}</span>
    <span className={`text-right ${status ? getStatusColor(value) : ""} ${status ? "font-semibold px-2 py-1 rounded-full" : ""} ${highlight ? "text-blue-700 font-bold" : "text-gray-800"}`}>{value}</span>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "paid":
      return "bg-blue-100 text-blue-700";
    case "confirmed":
      return "bg-indigo-100 text-indigo-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    case "expired":
      return "bg-gray-200 text-gray-700";
    case "review":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

export default BookingDetailModal;

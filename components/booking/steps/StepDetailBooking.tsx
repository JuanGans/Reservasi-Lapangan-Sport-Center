import React from "react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { Booking } from "@/types/booking";

interface StepDetailBookingProps {
  user: User | null | undefined;
  booking: Booking;
}

const StepDetailBooking: React.FC<StepDetailBookingProps> = ({ user, booking }) => {
  const durasi = booking.sessions?.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);

  return (
    <motion.div className="flex flex-col items-center mt-10 sm:mt-20 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <motion.img
        src={user?.user_img ? `/assets/user/${user.user_img}` : "/assets/user/default-avatar.jpg"}
        alt="User Avatar"
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        Detail Booking Anda
      </motion.h2>

      <motion.p className="text-sm text-gray-500 mb-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        Pastikan informasi berikut sudah benar sebelum melanjutkan.
      </motion.p>

      <motion.div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        {/* Informasi Diri */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informasi Diri</h3>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Nama Lengkap:</span> <span className="text-gray-700 text-sm sm:text-base">{user?.fullname || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Username:</span> <span className="text-gray-700 text-sm sm:text-base">{user?.username || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Email:</span> <span className="text-gray-700 text-sm sm:text-base">{user?.email || "-"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">No HP:</span> <span className="text-gray-700 text-sm sm:text-base">{user?.no_hp || "-"}</span>
          </div>
        </div>

        {/* Detail Booking */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Detail Booking</h3>
          <img src={`/assets/field/${booking.facility?.field_image}`} alt={booking.facility?.field_name} className="w-full h-36 object-cover rounded-lg mb-4 border" />
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Lapangan:</span> <span className="text-gray-700 text-sm sm:text-base">{booking.facility?.field_name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Tanggal:</span> <span className="text-gray-700 text-sm sm:text-base">{formatDate(booking.booking_date)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Sesi:</span> <span className="text-gray-700 text-sm sm:text-base">{booking.sessions?.map((s) => s.session_label).join(", ")}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Durasi:</span> <span className="text-gray-700 text-sm sm:text-base">{durasi} jam</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm sm:text-base">Total Bayar:</span> <span className="text-green-600 font-semibold text-sm sm:text-base">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepDetailBooking;

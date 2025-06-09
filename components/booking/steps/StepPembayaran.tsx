import React, { useState } from "react";
import { motion } from "framer-motion";
import { Booking } from "@/types/booking";

interface PaymentMethod {
  name: string;
  icon: string;
}

interface StepPembayaranProps {
  selectedMethod: PaymentMethod | null;
  countdown: number;
  booking: Booking;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const StepPembayaran: React.FC<StepPembayaranProps> = ({ selectedMethod, countdown, booking, showToast }) => {
  const isBank = selectedMethod ? ["BNI", "BCA", "BRI", "Mandiri"].includes(selectedMethod.name) : false;
  const isWallet = !isBank;

  const handleCopy = async (text: string, number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      showToast(`${text} telah disalin`, "info");
      return;
    } catch (err) {
      showToast("Gagal menyalin", "error");
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);

  const renderCountdown = () => {
    const min = String(Math.floor(countdown / 60)).padStart(2, "0");
    const sec = String(countdown % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const durasi = booking.sessions?.length || 0;
  const sesiText = booking.sessions?.map((s) => s.session_label).join(", ");
  const nomorRek = "123456789012345";
  const noHP = "081249217968";
  const namaPemilik = "Mochamad Imam Hanafi";

  return (
    <>
      <motion.div className="text-center px-4 mt-12 sm:mt-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <motion.div className="flex justify-center items-center mb-5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="rounded-full p-4 shadow-lg">
            <img src={`/assets/payment/${selectedMethod?.icon}`} alt={selectedMethod?.name} className="w-10 h-10" />
          </div>
        </motion.div>

        <motion.h2 className="text-2xl font-bold mb-4 text-blue-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Detail Pembayaran
        </motion.h2>

        <motion.div className="bg-white rounded-2xl p-6 shadow-md text-left text-sm text-gray-700 space-y-4 max-w-md w-full mx-auto border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {/* METODE */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Metode Pembayaran</span>
            <div className="flex items-center gap-2">
              <img src={`/assets/payment/${selectedMethod?.icon}`} alt={selectedMethod?.name} className="w-5 h-5" />
              <span className="text-blue-800 font-semibold">{selectedMethod?.name || "-"}</span>
            </div>
          </div>

          {/* REKENING / WALLET */}
          {isWallet && (
            <>
              <div className="flex justify-between items-center">
                <span className="font-medium">No HP Tujuan</span>
                <div className="flex items-center gap-2">
                  <span>{noHP}</span>
                  <button onClick={() => handleCopy("No HP", noHP)} className="text-blue-500 text-xs hover:underline flex items-center gap-1 cursor-pointer">
                    <i className="fas fa-copy"></i>
                    Salin
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Atas Nama</span>
                <span>{namaPemilik}</span>
              </div>
            </>
          )}
          {isBank && (
            <>
              <div className="flex justify-between items-center">
                <span className="font-medium">No Rekening</span>
                <div className="flex items-center gap-2">
                  <span>{nomorRek} (BRI)</span>
                  <button onClick={() => handleCopy("Nomor Rekening", nomorRek)} className="text-blue-500 text-xs hover:underline flex items-center gap-1 cursor-pointer">
                    <i className="fas fa-copy"></i>
                    Salin
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Atas Nama</span>
                <span>{namaPemilik}</span>
              </div>
            </>
          )}

          {/* TOTAL & COUNTDOWN */}
          <div className="flex justify-between border-t pt-3 text-gray-900 font-medium">
            <span>Total yang harus dibayar</span>
            <span className="text-green-600 font-bold">{formatPrice(booking.total_price)}</span>
          </div>
          <div className="flex justify-between text-red-600 font-semibold border-t pt-3">
            <span>Batas Waktu Pembayaran</span>
            <span>{renderCountdown()}</span>
          </div>

          {/* RINCIAN BOOKING */}
          <div className="border-t pt-4 space-y-2 text-gray-600 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Lapangan</span>
              <span>{booking.facility?.field_name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sesi</span>
              <span>{sesiText}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Durasi</span>
              <span>{durasi} jam</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default StepPembayaran;

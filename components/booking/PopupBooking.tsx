import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Landmark } from "lucide-react";

interface PopupBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  facilityName: string;
  selectedDate: string;
  selectedSessions: string[];
  totalPrice: number;
}

const formatTanggal = (iso: string) => {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const PopupBooking: React.FC<PopupBookingProps> = ({ isOpen, onClose, onConfirm, facilityName, selectedDate, selectedSessions, totalPrice }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="text-2xl font-semibold text-blue-900 flex items-center gap-2 mb-5">
              <Landmark className="w-6 h-6 text-blue-600" />
              Konfirmasi Pemesanan
            </h2>

            <div className="space-y-3 text-sm text-gray-700 divide-y divide-gray-200">
              <div className="pb-3 flex items-start gap-2">
                <Landmark className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium">Lapangan</p>
                  <p>{facilityName}</p>
                </div>
              </div>
              <div className="py-3 flex items-start gap-2">
                <CalendarDays className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium">Tanggal</p>
                  <p>{formatTanggal(selectedDate)}</p>
                </div>
              </div>
              <div className="py-3 flex items-start gap-2">
                <Clock className="w-4 h-4 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium">Sesi</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSessions.map((s) => (
                      <span key={s} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-3">
                <p className="font-medium text-blue-900">Total Harga</p>
                <p className="text-xl font-bold text-blue-700">Rp {totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                Batal
              </button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow transition cursor-pointer">
                Bayar Sekarang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupBooking;

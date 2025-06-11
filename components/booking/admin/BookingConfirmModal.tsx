import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facility } from "@/types/facility";
import { User } from "@/types/user";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedUser: User | null;
  selectedFacility: Facility | null;
  selectedDate: string;
  selectedSlots: string[];
  totalPrice: number;
};

const BookingConfirmationModal = ({ isOpen, onClose, onConfirm, selectedUser, selectedFacility, selectedDate, selectedSlots, totalPrice }: Props) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Konfirmasi Reservasi</h2>

            <div className="text-sm text-gray-700 space-y-2 mb-4">
              <p>
                <span className="font-semibold">User:</span> {selectedUser?.fullname}
              </p>
              <p>
                <span className="font-semibold">Lapangan:</span> {selectedFacility?.field_name}
              </p>
              <p>
                <span className="font-semibold">Tanggal:</span> {selectedDate}
              </p>
              <p>
                <span className="font-semibold">Jam:</span> {selectedSlots.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Total Harga:</span> Rp. {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer">
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              >
                Konfirmasi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingConfirmationModal;

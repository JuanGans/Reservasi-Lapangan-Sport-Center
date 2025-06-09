import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface PaymentMethod {
  name: string;
  icon: string;
}

interface ConfirmModalProps {
  selectedMethod: PaymentMethod | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ selectedMethod, onCancel, onConfirm }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-5">
          {selectedMethod && <img src={`/assets/payment/${selectedMethod.icon}`} alt={selectedMethod.name} className="w-10 h-10 object-contain rounded" />}
          <h2 className="text-lg font-semibold text-blue-900">Konfirmasi Pembayaran</h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Anda akan membayar menggunakan <strong>{selectedMethod?.name}</strong>.
          <br />
          Setelah konfirmasi, <span className="text-red-600 font-medium">anda tidak bisa membatalkan pembayaran</span> atau kembali ke langkah sebelumnya.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button onClick={onCancel} className="w-full sm:w-auto py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 border transition duration-200 cursor-pointer">
            Batal
          </button>
          <button onClick={onConfirm} className="w-full sm:w-auto py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 cursor-pointer">
            Konfirmasi
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;

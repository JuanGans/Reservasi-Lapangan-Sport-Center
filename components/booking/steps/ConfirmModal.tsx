import React from "react";
import { motion } from "framer-motion";

interface PaymentMethod {
  name: string;
  icon: string;
  color: string;
}

interface ConfirmModalProps {
  selectedMethod: PaymentMethod | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ selectedMethod, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          {selectedMethod && <img src={`/assets/payment/${selectedMethod.icon}`} alt={selectedMethod.name} className="w-10 h-10 object-contain rounded" />}
          <h2 className="text-lg font-semibold text-blue-900">Konfirmasi Pembayaran</h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Anda akan membayar menggunakan <strong>{selectedMethod?.name}</strong>.
          <br />
          Setelah konfirmasi, <span className="text-red-600 font-medium">anda tidak bisa membatalkan pembayaran</span> atau kembali ke step sebelumnya.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition">
            Batal
          </button>
          <button onClick={onConfirm} className={`py-2 px-4 rounded text-white ${selectedMethod?.color || "bg-blue-600"} hover:opacity-90 transition`}>
            Konfirmasi
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;

import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface PaymentModalProps {
  onClose: () => void;
  onSubmit: (file: File | null) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Upload Bukti Pembayaran</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition">
            Batal
          </button>
          <button disabled={!selectedFile} onClick={() => onSubmit(selectedFile)} className={`py-2 px-4 rounded text-white bg-blue-600 hover:opacity-90 transition disabled:bg-blue-300 disabled:cursor-not-allowed`}>
            Kirim Bukti
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;

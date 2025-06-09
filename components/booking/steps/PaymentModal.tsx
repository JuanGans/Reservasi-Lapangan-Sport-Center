import React, { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  onClose: () => void;
  onSubmit: (file: File | null, amount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setAmount(value); // only allow numbers
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 relative" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.3 }}>
        <h2 className="text-xl font-semibold text-blue-900 mb-5 text-center">Upload Bukti Pembayaran</h2>

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-56 object-contain border rounded-lg" />
          </div>
        )}

        {/* Amount input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pembayaran (Rp)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Contoh: 120000"
            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer">
            Batal
          </button>
          <button
            disabled={!selectedFile || !amount}
            onClick={() => onSubmit(selectedFile, parseInt(amount))}
            className="py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Kirim Bukti
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;

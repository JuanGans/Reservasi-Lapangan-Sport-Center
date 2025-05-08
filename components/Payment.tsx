// components/UploadPaymentProofModal.tsx
import React, { useState } from "react";
import { Check, Upload, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UploadPaymentProofModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatRupiah = (value: string) =>
    value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProof(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    if (!bookingId || !amount || !proof) {
      setMessage("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("amount", amount);
    formData.append("proof", proof);

    setTimeout(() => {
      setSuccess(true);
      setMessage("Bukti pembayaran berhasil diunggah!");
      setBookingId("");
      setAmount("");
      setProof(null);
      setFileName("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Upload Bukti Pembayaran</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Booking ID"
            className="w-full border px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            value={formatRupiah(amount)}
            onChange={handleAmountChange}
            placeholder="Jumlah"
            className="w-full border px-4 py-2 rounded-lg"
          />
          <label className="block border-dashed border-2 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {proof ? (
              <div className="text-blue-600 font-medium">{fileName}</div>
            ) : (
              <div className="text-gray-500">Klik untuk unggah bukti (JPG/PNG/PDF)</div>
            )}
          </label>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {success ? <Check className="inline w-4 h-4 mr-1" /> : <AlertCircle className="inline w-4 h-4 mr-1" />}
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? "Mengunggah..." : "Konfirmasi Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPaymentProofModal;

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { oldPassword: string; newPassword: string }) => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSave = () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      setError("Semua field wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setError("");
    onSave({ oldPassword, newPassword });
    onClose();

    setOldPassword("");
    setNewPassword("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-900">Ubah Password</h2>
              <button onClick={onClose} className="cursor-pointer">
                <X className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {/* Old Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md text-gray-700 p-2 pr-10"
                  placeholder="Masukkan password lama"
                />
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 cursor-pointer">
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md text-gray-700 p-2 pr-10"
                  placeholder="Masukkan password baru"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 cursor-pointer">
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <div className="flex justify-end">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                Simpan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdatePasswordModal;

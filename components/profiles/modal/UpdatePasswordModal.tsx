import React, { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";

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

  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
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
    handleClose();

    setOldPassword("");
    setNewPassword("");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? "opacity-0 pointer-events-none" : "opacity-100"} bg-black/30 backdrop-blur-sm`}>
      <div className={`relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10 transform transition-all duration-300 ${isVisible && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-900">Ubah Password</h2>
          <button onClick={handleClose} className="cursor-pointer">
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
          <input
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md text-gray-700 p-2"
            placeholder="Masukkan password lama"
          />
          <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute top-1/2 right-3 transform text-gray-600 cursor-pointer">
            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md text-gray-700 p-2"
            placeholder="Masukkan password baru"
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute top-1/2 right-3 transform text-gray-600 cursor-pointer">
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;

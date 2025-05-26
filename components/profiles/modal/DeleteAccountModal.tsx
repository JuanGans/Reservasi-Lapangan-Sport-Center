import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm }) => {
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
          <h2 className="text-lg font-semibold text-red-600">Hapus Akun</h2>
          <button onClick={handleClose} className="cursor-pointer">
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini <strong>tidak dapat dibatalkan</strong>.
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => {
              onConfirm();
              handleClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

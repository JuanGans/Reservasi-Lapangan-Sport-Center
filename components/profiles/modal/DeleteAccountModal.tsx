import React, { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-red-600">Hapus Akun</h2>
              <button onClick={onClose} className="cursor-pointer">
                <X className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini <strong>tidak dapat dibatalkan, dan semua data akan hilang.</strong>.
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400 transition cursor-pointer">
                Batal
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Hapus Akun
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;

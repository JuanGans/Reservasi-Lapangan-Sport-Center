import { motion, AnimatePresence } from "framer-motion";
import { Facility } from "@/types/facility";

interface DeleteConfirmationModalProps {
  facility: Facility | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ facility, onClose, onConfirm }) => {
  if (!facility) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Hapus Fasilitas?</h2>
          <p className="text-gray-600 mb-6">
            Apakah kamu yakin ingin menghapus <span className="font-medium text-red-600">{facility.field_name}</span>?
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer">
              Batal
            </button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer">
              Hapus
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;

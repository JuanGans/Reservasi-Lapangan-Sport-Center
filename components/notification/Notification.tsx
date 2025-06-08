import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { icons } from "@/types/notification";

type NotifikasiModalProps = {
  message: string;
  type?: "info" | "booking" | "payment" | "paid" | "confirmed" | "canceled" | "review" | "completed";
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  show: boolean;
};

const NotifikasiModal: React.FC<NotifikasiModalProps> = ({ message, type = "info", actionLabel, onAction, onClose, show }) => {
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center relative" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} transition={{ duration: 0.3 }}>
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-sm cursor-pointer">
              <i className="fas fa-times" />
            </button>

            {/* Icon */}
            <div className="text-4xl mb-4">
              <i className={icons[type]} />
            </div>

            {/* Message */}
            <p className="text-gray-800 text-sm mb-5">{message}</p>

            {/* Action Button */}
            {actionLabel && onAction && (
              <button onClick={onAction} className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
                {actionLabel}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotifikasiModal;

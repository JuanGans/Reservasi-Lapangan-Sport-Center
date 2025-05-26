import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); // trigger exit animation
      setTimeout(onClose, 300); // remove component after animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded text-white shadow-lg ${bgColor}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

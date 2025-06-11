// "use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  userId: number;
  user: string;
  onCancel: () => void;
  onDeleted: () => void;
}

export default function DeleteConfirmModal({ userId, user, onCancel, onDeleted }: Props) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus user");
      }

      onDeleted();
    } catch (err) {
      console.error("Gagal menghapus user", err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Hapus Pengguna</h2>
        <p className="text-sm text-gray-600 mb-6">
          Yakin ingin menghapus user ini, <strong>{user}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

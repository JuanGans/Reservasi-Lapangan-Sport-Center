// "use client";

import { motion } from "framer-motion";

interface Props {
  userId: number;
  onCancel: () => void;
  onDeleted: () => void;
}

export default function DeleteConfirmModal({ userId, onCancel, onDeleted }: Props) {
  const handleDelete = async () => {
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
      onDeleted();
    } catch (err) {
      console.error("Gagal menghapus user", err);
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <h2 className="text-lg font-semibold mb-4">Hapus Pengguna</h2>
        <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus user ini?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel}>Batal</button>
          <button onClick={handleDelete}>Hapus</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

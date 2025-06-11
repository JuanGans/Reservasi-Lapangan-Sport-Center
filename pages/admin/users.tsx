"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User } from "@/types/user";
import UserTable from "@/components/user/UserTable";
import UserModal from "@/components/user/UserModal";
import DeleteConfirmModal from "@/components/user/DeleteConfirmModal";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/getAllUsers");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteUserId(id);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Manajemen User">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="sm:text-2xl text-xl font-bold text-blue-900">Manajemen Pengguna</h1>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer sm:text-sm text-xs">
              + Tambah User
            </button>
          </div>

          {loading ? <div className="text-center py-20 animate-pulse text-gray-800">Loading data pengguna...</div> : <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />}

          {isModalOpen && (
            <UserModal
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
              refreshUsers={fetchUsers}
              onSuccess={(type) => {
                setToast({
                  message: `Data User Berhasil ${type === "add" ? "Ditambah" : "Diubah"}`,
                  type: "success",
                });
              }}
            />
          )}

          {deleteUserId !== null && (
            <DeleteConfirmModal
              userId={deleteUserId}
              onCancel={() => setDeleteUserId(null)}
              onDeleted={() => {
                setDeleteUserId(null);
                fetchUsers();
                setToast({ message: "Data User Berhasil Dihapus", type: "success" });
              }}
            />
          )}
        </motion.div>
      </DashboardLayout>
    </>
  );
}

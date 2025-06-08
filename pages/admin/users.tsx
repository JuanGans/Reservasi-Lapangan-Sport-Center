import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { AnimatePresence, motion } from "framer-motion";
// import { FaEdit, FaTrash } from "react-icons/fa";

type User = {
  id: number;
  fullname: string;
  username: string;
  email: string;
  role: string;
  no_hp?: string;
  password?: string;
};

type NewUser = {
  fullname: string;
  username: string;
  email: string;
  role: string;
  password: string;
  no_hp: string;
};

const UserAdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    fullname: "",
    username: "",
    email: "",
    role: "member",
    password: "",
    no_hp: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Untuk edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState<Omit<User, "id"> & { password?: string }>({
    fullname: "",
    username: "",
    email: "",
    role: "member",
    no_hp: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/getAll");
      if (!res.ok) throw new Error("Gagal mengambil data user");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Tambah user
  const handleAddUser = async () => {
    if (!newUser.fullname.trim() || !newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.no_hp.trim()) {
      setToast({ message: "Nama, username, email, password, dan nomor HP wajib diisi", type: "error" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setToast({ message: "Format email tidak valid", type: "error" });
      return;
    }
    if (newUser.username.length < 3 || /\s/.test(newUser.username)) {
      setToast({ message: "Username minimal 3 karakter dan tanpa spasi", type: "error" });
      return;
    }
    const no_hpRegex = /^[0-9]{8,15}$/;
    if (!no_hpRegex.test(newUser.no_hp)) {
      setToast({ message: "Nomor HP harus berupa angka 8-15 digit", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        no_hp: newUser.no_hp,
        imageUrl: "default-user.jpg",
      };

      const res = await fetch("/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan user");

      setUsers((prev) => [...prev, data]);
      setToast({ message: "User berhasil ditambahkan", type: "success" });
      setShowAddModal(false);
      setNewUser({
        fullname: "",
        username: "",
        email: "",
        role: "member",
        password: "",
        no_hp: "",
      });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Hapus user
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingUser.id }),
      });
      if (!res.ok) throw new Error("Gagal menghapus user");

      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setToast({ message: "User berhasil dihapus", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setDeletingUser(null);
      setLoading(false);
    }
  };

  // Buka modal edit dan isi data
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditUserData({
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      no_hp: user.no_hp || "",
      password: "",
    });
    setShowEditModal(true);
  };

  // Submit edit user
  const handleEditUser = async () => {
    if (!editUserData.fullname.trim() || !editUserData.username.trim() || !editUserData.email.trim()) {
      setToast({ message: "Nama, username, dan email wajib diisi", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUserData.email)) {
      setToast({ message: "Format email tidak valid", type: "error" });
      return;
    }

    const payload: any = {
      id: editingUser?.id,
      fullname: editUserData.fullname,
      username: editUserData.username,
      email: editUserData.email,
      role: editUserData.role,
      no_hp: editUserData.no_hp,
    };

    if (editUserData.password && editUserData.password.trim() !== "") {
      payload.password = editUserData.password;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setToast({ message: errorData.message || "Gagal update user", type: "error" });
        return;
      }

      setToast({ message: "User berhasil diperbarui", type: "success" });
      // Update user list
      setUsers((prev) => prev.map((u) => (u.id === editingUser?.id ? { ...u, ...payload } : u)));
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      setToast({ message: "Terjadi kesalahan saat menghubungi server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <DashboardLayout title="Manajemen User">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-900 font-semibold text-xl">Daftar Pengguna</h2>
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" disabled={loading}>
            + Tambah User
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">Tidak ada data pengguna.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto relative">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 text-black">No</th>
                  <th className="px-4 py-2 text-black">Nama Lengkap</th>
                  <th className="px-4 py-2 text-black">Username</th>
                  <th className="px-4 py-2 text-black">Email</th>
                  <th className="px-4 py-2 text-black">Nomor HP</th>
                  <th className="px-4 py-2 text-black">Role</th>
                  <th className="px-4 py-2 text-black text-center relative">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 relative">
                    <td className="px-4 py-2 text-black">{index + 1}</td>
                    <td className="px-4 py-2 text-black">{user.fullname}</td>
                    <td className="px-4 py-2 text-black">{user.username}</td>
                    <td className="px-4 py-2 text-black">{user.email}</td>
                    <td className="px-4 py-2 text-black">{user.no_hp ?? "-"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded font-semibold capitalize ${
                          user.role === "admin" ? "bg-blue-200 bg-opacity-50 text-blue-800" : user.role === "member" ? "bg-green-200 bg-opacity-50 text-green-800" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-black text-center relative">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="py-2 px-3 rounded-full bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white cursor-pointer"
                          disabled={loading}
                          aria-label={`Edit user ${user.fullname}`}
                        >
                          {/* <FaEdit /> */}
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="py-2 px-3 rounded-full bg-red-500 hover:bg-red-700 transition-all duration-300 text-white cursor-pointer"
                          disabled={loading}
                          aria-label={`Hapus user ${user.fullname}`}
                        >
                          {/* <FaTrash /> */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>

      {/* Modal Tambah User */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative overflow-auto max-h-[90vh]">
              <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-white bg-red-500 w-7 h-7 rounded-full text-center leading-7" disabled={loading}>
                ×
              </button>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Tambah User Baru</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={newUser.fullname}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, fullname: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))} className="w-full border px-3 py-2 rounded text-black" disabled={loading} />
                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} className="w-full border px-3 py-2 rounded text-black" disabled={loading} />
                <input type="text" placeholder="Nomor HP" value={newUser.no_hp} onChange={(e) => setNewUser((prev) => ({ ...prev, no_hp: e.target.value }))} className="w-full border px-3 py-2 rounded text-black" disabled={loading} />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <select value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))} className="w-full border px-3 py-2 rounded text-black" disabled={loading}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black" disabled={loading}>
                    Batal
                  </button>
                  <button onClick={handleAddUser} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Edit User */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative overflow-auto max-h-[90vh]">
              <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 text-white bg-red-500 w-7 h-7 rounded-full text-center leading-7" disabled={loading}>
                ×
              </button>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit User</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={editUserData.fullname}
                  onChange={(e) => setEditUserData((prev) => ({ ...prev, fullname: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={editUserData.username}
                  onChange={(e) => setEditUserData((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Nomor HP"
                  value={editUserData.no_hp}
                  onChange={(e) => setEditUserData((prev) => ({ ...prev, no_hp: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password (kosongkan jika tidak ingin diubah)"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full border px-3 py-2 rounded text-black"
                  disabled={loading}
                />
                <select value={editUserData.role} onChange={(e) => setEditUserData((prev) => ({ ...prev, role: e.target.value }))} className="w-full border px-3 py-2 rounded text-black" disabled={loading}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black" disabled={loading}>
                    Batal
                  </button>
                  <button onClick={handleEditUser} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {deletingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Konfirmasi Hapus</h2>
              <p className="mb-6 text-black">
                Apakah Anda yakin ingin menghapus user <strong>{deletingUser.fullname}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setDeletingUser(null)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black" disabled={loading}>
                  Batal
                </button>
                <button onClick={handleDeleteUser} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserAdminPage;

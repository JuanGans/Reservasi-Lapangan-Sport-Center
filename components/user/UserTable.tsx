// "use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { Pencil, Trash } from "lucide-react";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const ITEMS_PER_PAGE = 10;

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchName = user.fullname.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || user.role === roleFilter;
      return matchName && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <input type="text" placeholder="Cari nama..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 cursor-pointer w-full md:w-1/4">
          <option value="all">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left text-blue-900">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Username</th>
              <th className="p-3">Nama Lengkap</th>
              <th className="p-3">Email</th>
              <th className="p-3">No HP</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, i) => (
              <motion.tr key={user.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-gray-50 text-gray-800">
                <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.fullname}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.no_hp}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{user.role}</span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => onEdit(user)} className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 cursor-pointer">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button onClick={() => onDelete(user.id)} className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 cursor-pointer">
                    <Trash size={16} />
                    Hapus
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((user, i) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white shadow rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-800">#{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</div>
            <div className="text-gray-800 text-sm">
              <strong className="text-blue-900">Username:</strong> {user.username}
            </div>
            <div className="text-gray-800 text-sm">
              <strong className="text-blue-900">Nama:</strong> {user.fullname}
            </div>
            <div className="text-gray-800 text-sm">
              <strong className="text-blue-900">Email:</strong> {user.email}
            </div>
            <div className="text-gray-800 text-sm">
              <strong className="text-blue-900">No HP:</strong> {user.no_hp}
            </div>
            <div className="text-gray-800 text-sm">
              <strong className="text-blue-900">Role:</strong> <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>{user.role}</span>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => onEdit(user)} className="flex items-center gap-1 text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 w-full justify-center cursor-pointer">
                <Pencil size={16} />
                Edit
              </button>
              <button onClick={() => onDelete(user.id)} className="flex items-center gap-1 text-sm px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 w-full justify-center cursor-pointer">
                <Trash size={16} />
                Hapus
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

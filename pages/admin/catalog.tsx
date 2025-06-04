// /pages/admin/catalog.tsx
// import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Facility } from "@/types/facility";
import AdminFacilityCard from "@/components/catalog/AdminFacilityCard";
import FacilityForm from "@/components/catalog/FacilityForm";
import DeleteConfirmationModal from "@/components/catalog/DeleteConfirmationModal";
import SearchAndSort from "@/components/catalog/SearchAndSort";
import Pagination from "@/components/catalog/Pagination";

// Komponen utama halaman katalog
const CatalogAdminPage: React.FC = () => {
  // const router = useRouter();

  // State utama
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deletingFacility, setDeletingFacility] = useState<Facility | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const PAGE_SIZE = 6;

  // Nonaktifkan scroll saat modal terbuka
  useEffect(() => {
    const overflow = editingFacility || showAddModal || deletingFacility ? "hidden" : "auto";
    document.body.style.overflow = overflow;
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingFacility, showAddModal, deletingFacility]);

  // Ambil data fasilitas dari API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        if (!res.ok) throw new Error("Gagal mengambil data fasilitas");
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error(error);
        setToast({ message: "Gagal memuat data", type: "error" });
      }
    };
    fetchFacilities();
  }, []);

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
  };

  const handleDeleteFacility = (id: number) => {
    const facility = facilities.find((f) => f.id === id);
    if (facility) {
      setDeletingFacility(facility);
    }
  };

  const handleSaveEdit = async (formData: FormData) => {
    if (!editingFacility) return;

    try {
      formData.append("id", editingFacility.id.toString());

      // console.log(formData);
      const res = await fetch("/api/facilities/updateFacility", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan perubahan");

      setFacilities((prev) => prev.map((f) => (f.id === data.id ? data : f)));
      setToast({ message: `Berhasil menyimpan perubahan untuk ${data.field_name}`, type: "success" });
      setEditingFacility(null);
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menyimpan perubahan", type: "error" });
    }
  };

  const handleAddFacility = async (formData: FormData) => {
    try {
      const res = await fetch("/api/facilities/addFacility", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambahkan fasilitas");

      setFacilities((prev) => [...prev, data]);
      setToast({ message: "Fasilitas berhasil ditambahkan", type: "success" });
      setShowAddModal(false);
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menambahkan fasilitas", type: "error" });
    }
  };

  const confirmDeleteFacility = async () => {
    if (!deletingFacility) return;
    try {
      const res = await fetch(`/api/facilities/deleteFacility`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingFacility.id }),
      });

      if (!res.ok) throw new Error("Gagal menghapus fasilitas");
      setFacilities((prev) => prev.filter((f) => f.id !== deletingFacility.id));
      setToast({ message: "Fasilitas berhasil dihapus", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menghapus fasilitas", type: "error" });
    } finally {
      setDeletingFacility(null);
    }
  };

  // Data hasil pencarian dan sortir
  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];
    if (searchTerm.trim()) {
      filtered = filtered.filter((f) => f.field_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    filtered.sort((a, b) => {
      const priceA = Number(a.price_per_session);
      const priceB = Number(b.price_per_session);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
    return filtered;
  }, [facilities, searchTerm, sortOrder]);

  // Paginasi
  const totalPages = Math.ceil(filteredFacilities.length / PAGE_SIZE);
  const paginatedFacilities = filteredFacilities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Layout dan header */}
      <DashboardLayout title="Katalog Admin">
        <div className="flex justify-between items-center mb-4 mt-2">
          <h2 className="text-blue-900 font-semibold text-xl">Daftar Katalog Lapangan</h2>
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 text-sm py-2 rounded-lg shadow cursor-pointer">
            + Tambah Katalog
          </button>
        </div>

        <SearchAndSort searchTerm={searchTerm} onSearchChange={handleSearchChange} sortOrder={sortOrder} onSortChange={handleSortChange} />

        {/* Card Grid */}
        {paginatedFacilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
            <i className="fas fa-search fa-4x mb-4"></i> {/* FontAwesome v5 icon */}
            <p className="text-lg">Tidak ada lapangan ditemukan.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${totalPages > 1 ? "" : "pb-8"}`}>
            {paginatedFacilities.map((field) => (
              <AdminFacilityCard key={field.id} facility={field} onEdit={handleEditFacility} onDelete={handleDeleteFacility} />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {/* MODAL EDIT FACILITY */}
        <AnimatePresence>
          {editingFacility && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 overflow-auto max-h-[90vh]"
              >
                <button onClick={() => setEditingFacility(null)} className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                  <i className="fas fa-times text-sm" />
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Fasilitas</h2>
                <FacilityForm initialData={editingFacility} onSubmit={handleSaveEdit} onCancel={() => setEditingFacility(null)} submitLabel="Simpan" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL ADD FACILITY */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 overflow-auto max-h-[90vh]"
              >
                <button onClick={() => setShowAddModal(false)} className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                  <i className="fas fa-times text-sm" />
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tambah Fasilitas Baru</h2>
                <FacilityForm onSubmit={handleAddFacility} onCancel={() => setShowAddModal(false)} submitLabel="Tambah" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL HAPUS */}
        <DeleteConfirmationModal facility={deletingFacility} onClose={() => setDeletingFacility(null)} onConfirm={confirmDeleteFacility} />
      </DashboardLayout>
    </div>
  );
};

export default CatalogAdminPage;

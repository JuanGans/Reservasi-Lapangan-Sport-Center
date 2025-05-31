// /pages/admin/catalog.tsx
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/CardContent";

interface Facility {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string | null;
  price_per_session: number;
  avg_rating: number;
  total_review: number;
}

const CatalogPage: React.FC = () => {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Tangani toast dari query URL (misal setelah redirect add facility)
  useEffect(() => {
    if (router.query.toastMessage) {
      setToast({
        message: router.query.toastMessage as string,
        type: (router.query.toastType as "success" | "error" | "info") || "info",
      });

      // Hapus query toastMessage dan toastType agar toast tidak muncul terus
      const { toastMessage, toastType, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    }
  }, [router.query, router]);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFacilities(data);
        } else {
          setError("Data fasilitas tidak valid");
        }
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data fasilitas");
      } finally {
        setLoading(false);
      }
    }
    fetchFacilities();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus fasilitas ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/facilities/deleteFacility`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Gagal menghapus fasilitas");

      setFacilities((prev) => prev.filter((f) => f.id !== id));
      setToast({ message: "Fasilitas berhasil dihapus", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menghapus fasilitas", type: "error" });
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility({ ...facility });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEditingFacility((prev) => prev ? { ...prev, field_image: null } : null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingFacility) return;

    try {
      const formData = new FormData();
      formData.append("id", editingFacility.id.toString());
      formData.append("field_name", editingFacility.field_name);
      formData.append("field_desc", editingFacility.field_desc);
      formData.append("price_per_session", editingFacility.price_per_session.toString());

      if (selectedFile) {
        formData.append("field_image", selectedFile);
      }

      const res = await fetch("/api/facilities/updateFacility", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal menyimpan perubahan");

      setFacilities((prev) => prev.map((f) => (f.id === data.id ? data : f)));

      setToast({ message: `Berhasil menyimpan perubahan untuk ${data.field_name}`, type: "success" });
      setEditingFacility(null);
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menyimpan perubahan", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Catalog">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-900 font-semibold text-xl">Daftar Fasilitas</h2>
          <button
            onClick={() => router.push("/admin/add-facility")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            + Tambah Fasilitas
          </button>
        </div>

        {loading && <p>Loading fasilitas...</p>}
        {error && <p className="text-red-600">Gagal mengambil data fasilitas: {error}</p>}
        {!loading && !error && facilities.length === 0 && <p>Data fasilitas kosong.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="shadow-md rounded-lg overflow-hidden">
              {facility.field_image ? (
                <img
                  src={`${facility.field_image}?t=${Date.now()}`}
                  alt={facility.field_name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <CardContent>
                <h3 className="font-semibold text-lg mb-1">{facility.field_name}</h3>
                <p className="text-gray-700 text-sm mb-2">{facility.field_desc}</p>
                <p className="font-semibold mb-1">
                  Harga: Rp {facility.price_per_session.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => handleEdit(facility)} className="w-1/2 bg-blue-600 hover:bg-blue-700">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(facility.id)} className="w-1/2 bg-red-600 hover:bg-red-700">
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 overflow-auto max-h-[90vh]">
              <h2 className="text-lg font-semibold text-black">Edit Fasilitas</h2>
              <div>
                <label className="text-sm font-medium text-black">Nama Lapangan</label>
                <input
                  type="text"
                  className="w-full mt-1 border p-2 rounded bg-white text-black"
                  value={editingFacility.field_name}
                  onChange={(e) => setEditingFacility({ ...editingFacility, field_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black">Deskripsi</label>
                <textarea
                  className="w-full mt-1 border p-2 rounded bg-white text-black"
                  value={editingFacility.field_desc}
                  onChange={(e) => setEditingFacility({ ...editingFacility, field_desc: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black">Harga per Sesi</label>
                <input
                  type="number"
                  className="w-full mt-1 border p-2 rounded bg-white text-black"
                  value={editingFacility.price_per_session}
                  onChange={(e) =>
                    setEditingFacility({
                      ...editingFacility,
                      price_per_session: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black mb-1 block">Ganti Gambar Lapangan</label>
                <input
                  type="file"
                  accept="image/*"
                  id="fileUpload"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="fileUpload"
                  className="inline-block cursor-pointer bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  Pilih Gambar
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
                )}
                {!imagePreview && editingFacility.field_image && (
                  <img
                    src={editingFacility.field_image}
                    alt={editingFacility.field_name}
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button onClick={() => setEditingFacility(null)} className="bg-gray-500 hover:bg-gray-600">
                  Batal
                </Button>
                <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default CatalogPage;

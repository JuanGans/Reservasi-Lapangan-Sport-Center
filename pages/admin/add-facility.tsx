import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";

const AddFacilityPage: React.FC = () => {
  const router = useRouter();

  const [fieldName, setFieldName] = useState("");
  const [fieldDesc, setFieldDesc] = useState("");
  const [pricePerSession, setPricePerSession] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Buat preview URL setiap kali file dipilih
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Cleanup URL object ketika file berubah atau komponen unmount
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setPricePerSession("");
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        setPricePerSession(num);
      }
    }
  };

  const handleSubmit = async () => {
    if (!fieldName || !fieldDesc || pricePerSession === "" || pricePerSession <= 0) {
      setToast({ message: "Mohon isi semua field dengan benar", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("field_name", fieldName);
      formData.append("field_desc", fieldDesc);
      formData.append("price_per_session", pricePerSession.toString());

      if (selectedFile) {
        formData.append("field_image", selectedFile);
      }

      const res = await fetch("/api/facilities/addFacility", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal menambahkan fasilitas");

      router.push({
        pathname: "/admin/catalog",
        query: {
          toastMessage: `Berhasil menambahkan fasilitas: ${data.field_name}`,
          toastType: "success",
        },
      });
    } catch (error: any) {
      setToast({ message: error.message || "Gagal menambahkan fasilitas", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Tambah Fasilitas">
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
          <h2 className="text-xl text-black font-semibold">Tambah Fasilitas Baru</h2>

          <div>
            <label className="text-black block font-medium mb-1">Nama Lapangan</label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="text-black w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-black block font-medium mb-1">Deskripsi</label>
            <textarea
              value={fieldDesc}
              onChange={(e) => setFieldDesc(e.target.value)}
              className="text-black w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="text-black block font-medium mb-1">Harga per Sesi</label>
            <input
              type="number"
              value={pricePerSession}
              onChange={handlePriceChange}
              className="text-black w-full border rounded px-3 py-2"
              min={0}
            />
          </div>

          <div>
            <label className="text-black block font-medium mb-1">Upload Gambar Lapangan</label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="fileUpload"
              className="inline-block cursor-pointer bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Pilih Gambar
            </label>

            {/* Preview gambar */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview Gambar"
                className="mt-2 max-h-48 object-contain rounded border"
              />
            )}
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Tambah Fasilitas"}
          </Button>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AddFacilityPage;

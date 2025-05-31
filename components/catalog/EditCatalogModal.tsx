// /components/catalog/EditCatalogModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface Facility {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string | null;
  price_per_session: number;
  avg_rating: number;
  total_review: number;
}

interface EditCatalogModalProps {
  facility: Facility;
  onClose: () => void;
  onSave: (updatedFacility: Facility, selectedFile: File | null) => void;
}

const EditCatalogModal: React.FC<EditCatalogModalProps> = ({ facility, onClose, onSave }) => {
  const [editedFacility, setEditedFacility] = useState<Facility>(facility);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setEditedFacility(facility);
    setImagePreview(null);
    setSelectedFile(null);
  }, [facility]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedFacility, selectedFile);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay with blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 overflow-auto max-h-[90vh] z-10">
        <h2 className="text-lg font-semibold text-black">Edit Fasilitas</h2>

        <div>
          <label className="text-sm font-medium text-black">Nama Lapangan</label>
          <input
            type="text"
            className="w-full mt-1 border p-2 rounded bg-white text-black"
            value={editedFacility.field_name}
            onChange={(e) => setEditedFacility({ ...editedFacility, field_name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black">Deskripsi</label>
          <textarea
            className="w-full mt-1 border p-2 rounded bg-white text-black"
            value={editedFacility.field_desc}
            onChange={(e) => setEditedFacility({ ...editedFacility, field_desc: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-black">Harga per Sesi</label>
          <input
            type="number"
            className="w-full mt-1 border p-2 rounded bg-white text-black"
            value={editedFacility.price_per_session}
            onChange={(e) =>
              setEditedFacility({ ...editedFacility, price_per_session: parseFloat(e.target.value) })
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
          {!imagePreview && editedFacility.field_image && (
            <img
              src={editedFacility.field_image}
              alt={editedFacility.field_name}
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCatalogModal;

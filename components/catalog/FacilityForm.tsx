import { Facility } from "@/types/facility";
import { useState, useEffect } from "react";

interface FacilityFormProps {
  initialData?: Facility;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ initialData, onSubmit, onCancel, submitLabel }) => {
  const [formData, setFormData] = useState({
    field_name: initialData?.field_name || "",
    field_desc: initialData?.field_desc || "",
    price_per_session: initialData?.price_per_session || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.field_image ? `/assets/field/${initialData.field_image}` : null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    if (selectedFile) submitData.append("field_image", selectedFile);
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col items-center">
        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full md:h-68 bg-gray-300 object-cover object-center" />
          ) : (
            <div className="flex items-center justify-center w-full h-full md:h-68 bg-gray-300 text-gray-400">Tidak ada gambar</div>
          )}
        </div>

        <input type="file" accept="image/*" id="fileUpload" onChange={handleImageChange} className="hidden" />
        <label htmlFor="fileUpload" className="mt-3 inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          {imagePreview ? "Ganti Gambar" : "Pilih Gambar"}
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Lapangan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full mt-1 border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.field_name}
            onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full mt-1 border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.field_desc}
            onChange={(e) => setFormData({ ...formData, field_desc: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Harga per Sesi <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full mt-1 border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.price_per_session}
            onChange={(e) => setFormData({ ...formData, price_per_session: e.target.value })}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FacilityForm;

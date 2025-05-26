import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface ProfileData {
  fullname: string;
  email: string;
  username: string;
  no_hp: string;
  user_img: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (updatedData: ProfileData) => void;
}

const EditPersonalInfoModal: React.FC<EditModalProps> = ({ isOpen, onClose, profileData, onSave }) => {
  const [form, setForm] = useState<ProfileData>({
    fullname: "",
    username: "",
    email: "",
    no_hp: "",
    user_img: "", // ini string, misalnya nama file di server
  });

  const [file, setFile] = useState<File | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImg, setPreviewImg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string | false>>({});

  // MUNCUL MODAL + TAMPIL GAMBAR
  useEffect(() => {
    if (isOpen) {
      setForm(profileData);
      setPreviewImg(`/assets/user/${profileData.user_img}`);
      setIsClosing(false);
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, profileData]);

  // UBAH ISIAN FORM
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;
    let errorMessage = "";

    if (name === "username") {
      newValue = value.replace(/\s+/g, ""); // Hapus spasi otomatis
      if (/\s/.test(value)) {
        errorMessage = "Username tidak boleh mengandung spasi";
      } else if (!newValue.trim()) {
        errorMessage = "Field tidak boleh kosong";
      }
    } else if (name === "no_hp") {
      newValue = value.replace(/[^0-9]/g, ""); // Hanya angka
      if (/[^0-9]/.test(value)) {
        errorMessage = "Nomor HP hanya boleh angka";
      } else if (!newValue.trim()) {
        errorMessage = "Field tidak boleh kosong";
      }
    } else {
      if (!newValue.trim()) {
        errorMessage = "Field tidak boleh kosong";
      }
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // MENGGANTI PROFILE IMAGE (MASUK INPUTAN)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFile(file); // simpan ke state tersendiri
      setPreviewImg(url);
      setForm((prev) => ({ ...prev, user_img: file.name, file }));
    }
  };

  // VALIDASI FORM (MENGECEK ERROR ATAU TIDAK)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | false> = {};
    let isValid = true;

    (Object.keys(form) as (keyof ProfileData)[]).forEach((key) => {
      const value = form[key];
      if (typeof value === "string" && !value.trim()) {
        newErrors[key] = "Field tidak boleh kosong";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // SAVE PROFILE -> DIARAHKAN KEMBALI KE COMPONENT PARENT
  const handleSave = () => {
    if (validateForm()) {
      onSave(form);
      handleClose();
    }
  };

  // KETIKA CLOSE MODAL
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? "opacity-0 pointer-events-none" : "opacity-100"} bg-black/30 backdrop-blur-sm`}>
      <div className={`relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10 transform transition-all duration-300 ${isVisible && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-900">Edit Profil</h2>
          <button onClick={handleClose} className="cursor-pointer">
            <X className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border bg-gray-100">
              <img src={previewImg || "/assets/user/default-user.jpg"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer">
                Ganti Foto
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          <InputField label="Nama Lengkap" name="fullname" value={form.fullname} onChange={handleChange} error={errors.fullname} disabled={false} />
          <InputField label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} disabled={false} />
          <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} disabled={true} />
          <InputField label="Nomor Handphone" name="no_hp" type="tel" value={form.no_hp} onChange={handleChange} error={errors.no_hp} disabled={false} />
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// COMPONENT KOLOM INPUT (MENGATASI ERROR DAN REUSABLE INPUT)
const InputField: React.FC<{
  label: string;
  name: keyof ProfileData;
  type?: string;
  value: string;
  error?: string | false;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, type = "text", value, onChange, error, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 
        ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
      `}
      placeholder={`Masukkan ${label.toLowerCase()}`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default EditPersonalInfoModal;

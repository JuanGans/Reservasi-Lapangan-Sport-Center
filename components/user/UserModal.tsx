// "use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { User } from "@/types/user";

interface Props {
  user: User | null;
  onClose: () => void;
  onSuccess: (type: "add" | "edit") => void;
  refreshUsers: () => void;
}

export default function UserModal({ user, onClose, onSuccess, refreshUsers }: Props) {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    no_hp: "",
    role: "member",
  });

  const [fieldErrors, setFieldErrors] = useState({
    fullname: "",
    email: "",
    username: "",
    no_hp: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        password: "",
        no_hp: user.no_hp,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedValue = value.trimStart();
    let errorMsg = "";

    if (["fullname", "username", "email", "no_hp"].includes(name) && updatedValue === "") {
      errorMsg = `${name === "no_hp" ? "No HP" : name.charAt(0).toUpperCase() + name.slice(1)} tidak boleh kosong.`;
    }

    if (name === "no_hp") {
      const cleaned = updatedValue.replace(/\D/g, "");
      if (cleaned !== updatedValue) {
        errorMsg = "No HP hanya boleh berisi angka.";
      }
      updatedValue = cleaned;
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    const newErrors = {
      fullname: formData.fullname.trim() === "" ? "Nama lengkap wajib diisi." : "",
      username: formData.username.trim() === "" ? "Username wajib diisi." : "",
      email: formData.email.trim() === "" ? "Email wajib diisi." : "",
      no_hp: formData.no_hp.trim() === "" ? "No HP wajib diisi." : "",
    };

    setFieldErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
    if (hasErrors) {
      setLoading(false);
      return;
    }

    let payload: any;

    if (isEdit) {
      payload = {
        id: user?.id,
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        no_hp: formData.no_hp,
      };
    } else {
      if (!formData.password.trim()) {
        setSubmitError("Password wajib diisi saat tambah user.");
        setLoading(false);
        return;
      }
      payload = { ...formData };
    }

    try {
      const res = await fetch(isEdit ? "/api/users/editUser" : "/api/users/addUser", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menyimpan data.");
      }

      onSuccess(isEdit ? "edit" : "add");
      refreshUsers();
      onClose();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 md:p-8 relative md:scale-100 scale-80" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">{isEdit ? "Edit User" : "Tambah User"}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField name="fullname" label="Nama Lengkap" required value={formData.fullname} onChange={handleChange} error={fieldErrors.fullname} />
            <InputField name="username" label="Username" required value={formData.username} onChange={handleChange} error={fieldErrors.username} />
            <InputField name="email" label="Email" type="email" required value={formData.email} onChange={handleChange} error={fieldErrors.email} />
            <InputField name="no_hp" label="No HP" required value={formData.no_hp} onChange={handleChange} error={fieldErrors.no_hp} />

            {!isEdit && (
              <div className="md:col-span-2 relative">
                <InputField name="password" label="Password" required type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-9 text-sm text-blue-600 cursor-pointer">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="role" className="text-blue-900 font-medium mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select name="role" id="role" value={formData.role} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 cursor-pointer">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function InputField({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  required?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} className="text-blue-900 font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

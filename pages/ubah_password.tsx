import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/toast/Toast";
import AuthLayout from "@/layout/AuthLayout";

export default function UbahPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const router = useRouter();

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleNewPasswordChange = (value: string) => {
    if (/\s/.test(value)) {
      setNewPasswordError("Password tidak boleh mengandung spasi.");
    } else if (value.length > 0 && value.length < 6) {
      setNewPasswordError("Password minimal 6 karakter.");
    } else {
      setNewPasswordError("");
    }
    setNewPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    if (/\s/.test(value)) {
      setConfirmPasswordError("Password tidak boleh mengandung spasi.");
    } else if (value.length > 0 && value.length < 6) {
      setConfirmPasswordError("Password minimal 6 karakter.");
    } else {
      setConfirmPasswordError("");
    }
    setConfirmPassword(value);
  };

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("reset_user_id");

    if (!storedId) {
      sessionStorage.setItem("reset_error", "Link tidak valid atau sudah kedaluwarsa.");
      router.replace("/forget_password");
    } else {
      setUserId(storedId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setToast({ message: "Konfirmasi password tidak cocok.", type: "error" });
      return;
    }

    const res = await fetch("/api/auth/update_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      sessionStorage.removeItem("reset_user_id");
      setToast({ message: "Password berhasil diubah. Mengalihkan ke login...", type: "success" });
      setIsExiting(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      setToast({ message: data.message || "Terjadi kesalahan", type: "error" });
    }
  };

  if (!userId) return null;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AuthLayout title="Ubah Password" isExit={isExiting}>
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Ubah Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Baru */}
          <div className="relative">
            <label className="block text-sm font-semibold text-blue-900">Password Baru</label>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Masukkan password baru"
              className={`w-full border rounded px-4 py-2 mt-1 text-black ${newPasswordError ? "border-red-500" : ""}`}
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-3 top-9 text-gray-600 cursor-pointer">
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {newPasswordError && <p className="text-sm text-red-500 mt-1">{newPasswordError}</p>}
          </div>

          {/* Konfirmasi Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-blue-900">Konfirmasi Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              className={`w-full border rounded px-4 py-2 mt-1 text-black ${confirmPasswordError ? "border-red-500" : ""}`}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-9 text-gray-600 cursor-pointer">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {confirmPasswordError && <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white py-2 mt-4 rounded hover:bg-blue-800 transition cursor-pointer">
            Reset Password
          </button>
        </form>
      </AuthLayout>
    </>
  );
}

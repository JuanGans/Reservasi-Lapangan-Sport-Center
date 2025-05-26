import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Toast from "@/components/toast/Toast";
import AuthLayout from "@/layout/AuthLayout";

export default function ForgetPassword() {
  const [identifier, setIdentifier] = useState(""); // email atau nomor HP
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const err = sessionStorage.getItem("reset_error");
    if (err) {
      setToast({ message: err, type: "error" });
      sessionStorage.removeItem("reset_error");
    }
  }, []);

  const handleNavigate = (path: string) => {
    setIsExiting(true); // Mulai animasi keluar
    setTimeout(() => {
      router.push(path);
    }, 500); // Tunggu 1 detik untuk animasi keluar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });

    const data = await res.json();
    if (res.ok) {
      setToast({ message: data.message, type: "success" });
      setIsExiting(true);
      sessionStorage.setItem("reset_user_id", data.userId);
      setTimeout(() => {
        router.push("/ubah_password");
      }, 1000);
    } else {
      setToast({ message: data.message || "Terjadi kesalahan", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AuthLayout title="Lupa Password" isExit={isExiting}>
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Lupa Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-100">Email atau Nomor HP</label>
            <input type="text" placeholder="Masukkan email atau nomor HP" className="w-full border rounded px-4 py-2 mt-1 text-black" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition cursor-pointer">
            Verifikasi
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <button onClick={() => handleNavigate("/login")} className="text-blue-900 hover:text-blue-500 hover:underline cursor-pointer">
            Kembali ke Login
          </button>
        </div>
      </AuthLayout>
    </>
  );
}

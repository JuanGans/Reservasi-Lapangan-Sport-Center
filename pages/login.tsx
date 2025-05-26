import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff, Home } from "lucide-react";
import Toast from "@/components/toast/Toast";
import AuthLayout from "@/layout/AuthLayout";

export default function Login() {
  // STATE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("member");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  // NAVIGASI SUPAYA BISA FADEOUT
  const handleNavigate = (path: string) => {
    setIsExiting(true); // Mulai animasi keluar
    setTimeout(() => {
      router.push(path);
    }, 500); // Tunggu 1 detik untuk animasi keluar
  };

  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // LOGIN
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    // RESPONSE
    const data = await res.json();
    if (res.ok) {
      setToast({ message: data.message, type: "success" });
      localStorage.setItem("token", data.token);
      setIsExiting(true); // Mulai animasi keluar

      // Wait for the animation to complete before routing
      setTimeout(() => {
        window.location.href = role === "admin" ? "/admin" : "/member";
      }, 1000);
    } else {
      setToast({ message: data.message, type: "error" });
    }
  };

  // TAMPILAN LOGIN (FRONTEND)
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AuthLayout title="Login" isExit={isExiting}>
        {/* Tombol Home */}
        <button onClick={() => handleNavigate("/")} className="absolute top-4 left-4 text-blue-900 hover:text-blue-700 transition cursor-pointer" title="Kembali ke Beranda">
          <Home size={24} />
        </button>

        {/* TEKS MASUK */}
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-8">Login</h2>

        {/* FORM LOGIN */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* LABEL USERNAME */}
          <div>
            <label className="block text-sm font-semibold text-blue-900">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* LABEL PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-blue-900">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* SHOW PASSWORD */}
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* LABEL ROLE DROPDOWN */}
          <div>
            <label className="block text-sm font-semibold text-blue-900">Login sebagai</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer" required>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* LUPA PASSWORD */}
          <button type="button" onClick={() => handleNavigate("/forget_password")} className="text-blue-500 hover:underline hover:text-blue-900 cursor-pointer">
            Lupa Password
          </button>

          {/* TOMBOL LOGIN */}
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition cursor-pointer">
            Login
          </button>

          {/* TOMBOL REGISTRASI */}
          <button type="button" onClick={() => handleNavigate("/register")} className="w-full bg-gray-600 text-white py-2 rounded cursor-pointer">
            Registrasi
          </button>

          {/* LOGO JTI SPORT CENTER */}
          <div className="text-center mt-4 text-sm">
            <img src="/assets/logo/jtisportcenter.png" alt="Poltek Logo" className="mx-auto h-16" />
          </div>
        </form>
      </AuthLayout>
    </>
  );
}

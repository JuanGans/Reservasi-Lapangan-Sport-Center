import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/toast/Toast";
import AuthLayout from "@/layout/AuthLayout";

export default function Register() {
  // FORM
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [password, setPassword] = useState("");
  const [userImg, setUserImg] = useState<File | null>(null);

  // PREVIEW URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // USERNAME AND PASSWORD
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // TOAST AND ANIMATION
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const router = useRouter();

  // Ganti handleNavigate jadi langsung push saja
  const handleNavigate = (path: string) => {
    setIsExiting(true); // Mulai animasi keluar
    setTimeout(() => {
      router.push(path);
    }, 500); // Tunggu 1 detik untuk animasi keluar
  };

  // FUNGSI REVIEW IMAGE
  useEffect(() => {
    if (userImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(userImg);
    } else {
      setPreviewUrl(null);
    }
  }, [userImg]);

  // HANDLE REGISTRASI
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6 || confirmPassword.length < 6) {
      setToast({ message: "Password minimal 6 karakter.", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: "Password dan konfirmasi tidak cocok.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("no_hp", noHp);
    formData.append("password", password);
    if (userImg) {
      formData.append("user_img", userImg);
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setToast({ message: data.message || "Registrasi gagal", type: "error" });
      return;
    }

    setToast({ message: data.message, type: "success" });
    setIsExiting(true);

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AuthLayout title="Register" isExit={isExiting}>
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">Register</h2>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
          {/* Profile Picture Preview */}
          <div className="col-span-full flex flex-col items-center mb-2">
            <label htmlFor="user_img" className="cursor-pointer relative group">
              <div className="w-24 h-24 rounded-full border-4 border-blue-900 overflow-hidden bg-white/80 flex items-center justify-center">
                <img src={previewUrl || "/assets/user/default-user.jpg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </label>
            <input type="file" id="user_img" accept="image/*" onChange={(e) => setUserImg(e.target.files?.[0] || null)} className="hidden" />
            <label htmlFor="user_img" className="mt-3 text-sm bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded cursor-pointer transition">
              Tambah Gambar
            </label>
          </div>

          {/* Left Column */}
          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input type="text" className="w-full p-2 border rounded text-black" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
          </div>

          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              value={username}
              onChange={(e) => {
                const original = e.target.value;
                const noSpaces = original.replace(/\s/g, "");
                setUsername(noSpaces);

                if (original !== noSpaces) {
                  setToast({ message: "Spasi tidak diperbolehkan! Telah dihapus otomatis.", type: "error" });
                }
              }}
              required
            />
          </div>

          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email" className="w-full p-2 border rounded text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Nomor HP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              value={noHp}
              onChange={(e) => {
                const original = e.target.value;
                const onlyDigits = original.replace(/[^\d]/g, ""); // Hanya angka

                if (original !== onlyDigits) {
                  setToast({
                    message: "Nomor HP hanya boleh berisi angka. Karakter lain telah dihapus otomatis.",
                    type: "error",
                  });
                }

                if (onlyDigits.length > 15) {
                  setToast({
                    message: "Nomor HP tidak boleh lebih dari 15 digit.",
                    type: "error",
                  });
                  return;
                }

                setNoHp(onlyDigits);
              }}
              required
            />
          </div>

          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* Password Field */}
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded text-black pr-10"
                value={password}
                onChange={(e) => {
                  const input = e.target.value;

                  if (/\s/.test(input)) {
                    setToast({ message: "Password tidak boleh mengandung spasi.", type: "error" });
                    return;
                  }

                  setPassword(input);
                }}
                required
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-blue-900 font-semibold block mb-1">
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* Confirm Password Field */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-2 border rounded text-black pr-10"
                value={confirmPassword}
                onChange={(e) => {
                  const input = e.target.value;

                  if (/\s/.test(input)) {
                    setToast({ message: "Konfirmasi password tidak boleh mengandung spasi.", type: "error" });
                    return;
                  }

                  setConfirmPassword(input);
                }}
                required
              />

              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button Full Width */}
          <div className="col-span-full">
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition cursor-pointer">
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-black text-center">
          Sudah punya akun?{" "}
          <button type="button" onClick={() => handleNavigate("/login")} className="text-blue-500 underline hover:text-blue-900 cursor-pointer">
            Login
          </button>
        </p>
      </AuthLayout>
    </>
  );
}

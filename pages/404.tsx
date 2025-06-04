import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const teamImages = ["/assets/team/alifia_team.png", "/assets/team/ello_team.png", "/assets/team/juan_team.png", "/assets/team/imam_team.png", "/assets/team/abhel_team.png"];

export default function NotFound() {
  const router = useRouter();
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * teamImages.length);
    setRandomImage(teamImages[randomIdx]);

    const fetchRoleAndRedirect = async () => {
      let userRole = "guest";

      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        userRole = data.role?.toLowerCase() || "guest";
        setRole(userRole);
      } catch {
        setRole("guest");
      } finally {
        setLoading(false);

        // Tentukan path berdasarkan role
        const targetPath = userRole === "admin" || userRole === "member" ? `/${userRole}` : "/";

        setTimeout(() => {
          router.push(targetPath);
        }, 5000);
      }
    };

    fetchRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-5xl font-bold text-blue-800 mb-3">404</h1>
      <p className="text-lg text-gray-600 mb-4">Halaman tidak ditemukan.</p>

      <div className="w-36 h-36 mb-4 rounded-full overflow-hidden border-4 border-white shadow">
        {randomImage ? <img src={randomImage} alt="Random Person" className="object-cover w-full h-full" /> : <div className="w-full h-full bg-gray-200 animate-pulse" />}
      </div>

      {loading ? (
        <div className="flex flex-col items-center space-y-2 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>
          <p className="text-sm">Memuat data pengguna...</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Mengalihkan ke <strong>{role === "admin" || role === "member" ? `dashboard ${role}` : "beranda"}</strong> dalam 5 detik...
          </p>
          <button onClick={() => router.push(role === "admin" || role === "member" ? `/${role}` : `/`)} className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 transition cursor-pointer">
            Kembali Sekarang
          </button>
        </>
      )}
    </div>
  );
}

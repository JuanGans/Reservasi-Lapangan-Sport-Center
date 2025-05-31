import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MainLayout from "@/layout/MainLayout";
import Toast from "@/components/toast/Toast";
import LandingAnimation from "@/components/animation/LandingAnimation";
import { motion, AnimatePresence } from "framer-motion";
import FAQAnimation from "@/components/animation/FAQAnimation";
import ReviewCarousel from "@/components/animation/ReviewCarousel";

type Facility = {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string;
  price_per_session: string;
  avg_rating?: number;
  total_review?: number;
};

export default function Home() {
  const [selectedField, setSelectedField] = useState<Facility | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { expired, logout } = router.query;

    if (router.query.unauthorized === "1") {
      setToast({ message: "Akses tidak diizinkan. Silakan login.", type: "error" });
      router.replace("/", undefined, { shallow: true });
    }

    if (expired === "1") {
      setToast({ message: "Sesi login telah kadaluarsa. Silakan login ulang.", type: "error" });
    } else if (logout === "1") {
      setToast({ message: "Berhasil logout.", type: "info" });
    }

    if (expired || logout) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        const data = await res.json();
        console.log("Fetched facilities data:", data);

        if (Array.isArray(data)) {
          setFacilities(data);
        } else if (Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        } else {
          console.warn("Data facilities tidak dalam format array:", data);
          setFacilities([]); // fallback supaya tidak error saat render
        }
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
        setFacilities([]); // fallback supaya tidak error saat render
      }
    }
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accountDeleted")) {
      setToast({ message: "Akun berhasil dihapus", type: "success" });
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedField ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedField]);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <MainLayout title="Beranda">
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-center px-4 sm:px-6 md:px-12 lg:px-24"
          style={{ backgroundImage: "url('/assets/bg/futsal.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 mt-24 px-4">
            <LandingAnimation>
              <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Selamat Datang di Website Sport Center JTI POLINEMA!
              </h1>
            </LandingAnimation>
            <LandingAnimation delay={0.1}>
              <p className="text-white max-w-2xl mx-auto text-base sm:text-lg md:text-xl drop-shadow-md">
                Tempat booking lapangan, jadwal latihan, dan informasi seputar sport center JTI Polinema dengan mudah dan cepat.
              </p>
            </LandingAnimation>
          </div>
        </section>

        {/* ABOUT */}
        <section id="catalog" className="relative bg-blue-100 py-10 px-4 sm:px-6">
          <LandingAnimation>
            <div className="text-center text-blue-900 text-2xl font-semibold">Tentang</div>
          </LandingAnimation>
          <LandingAnimation delay={0.1}>
            <p className="text-blue-900 max-w-xl mx-auto drop-shadow-md text-center mt-2 text-base">
              Platform digital untuk melakukan pemesanan lapangan dan melihat jadwal kegiatan olahraga di lingkungan JTI Polinema.
            </p>
          </LandingAnimation>
        </section>

        <section className="bg-blue-100">
          <LandingAnimation>
            <hr className="w-1/2 h-1 mx-auto bg-blue-900 border-0 rounded-sm" />
          </LandingAnimation>
        </section>

        {/* CATALOG */}
        <section className="bg-blue-100 px-4 sm:px-6 py-10">
          <div className="text-center mb-8">
            <LandingAnimation>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Katalog Lapangan</h2>
            </LandingAnimation>
            <LandingAnimation delay={0.1}>
              <p className="text-gray-700">Temukan lapangan terbaik untuk kebutuhan olahraga Anda</p>
            </LandingAnimation>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(facilities) &&
              facilities.map((field) => (
                <LandingAnimation key={field.id} delay={field.id * 0.1}>
                  <div
                    className="bg-white shadow-md rounded-lg p-4 hover:scale-105 transition cursor-pointer"
                    onClick={() => setSelectedField(field)}
                  >
                    <img
                      src={field.field_image || "/fallback.jpg"}
                      alt={field.field_name}
                      className="rounded-md mb-3 w-full h-48 object-cover"
                    />
                    <h3 className="text-blue-900 font-bold mb-2">{field.field_name}</h3>
                    <p className="text-gray-600 text-sm">{field.field_desc}</p>
                  </div>
                </LandingAnimation>
              ))}
          </div>

          <LandingAnimation>
            <div className="mt-10 text-center">
              <a href="/catalog" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Lihat Semua Katalog
              </a>
            </div>
          </LandingAnimation>
        </section>

        {/* MODAL */}
        <AnimatePresence>
          {selectedField && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 sm:p-8 rounded-lg w-[90%] max-w-md text-center relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl cursor-pointer"
                  onClick={() => setSelectedField(null)}
                >
                  X
                </button>
                <img
                  src={selectedField.field_image || "/fallback.jpg"}
                  alt={selectedField.field_name}
                  className="rounded-md mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-blue-900 font-bold text-xl mb-2">{selectedField.field_name}</h3>
                <p className="text-gray-700 mb-2">{selectedField.field_desc}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Harga: Rp. {parseInt(selectedField.price_per_session).toLocaleString()}
                </p>
                <Link href={`/detail_catalog?id=${selectedField.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Lihat Lapangan
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REVIEW */}
        <ReviewCarousel />

        {/* FEATURE */}
        <section className="bg-white text-center py-16 px-4">
          <LandingAnimation>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Latihan Jadi Lebih Mudah</h2>
          </LandingAnimation>
          <LandingAnimation delay={0.1}>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto text-base">
              Dengan proses pendaftaran yang simpel dan sistem booking lokal, reservasi jadwalmu makin praktis.
            </p>
          </LandingAnimation>
          <LandingAnimation delay={0.2}>
            <Link
              href="/login"
              className="inline-block bg-blue-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-blue-700 text-sm sm:text-base"
            >
              Pesan Sekarang
            </Link>
          </LandingAnimation>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-blue-100 pt-12 pb-24 px-4 sm:px-6">
          <LandingAnimation>
            <h2 className="text-center text-2xl font-bold text-blue-900 mb-8">Frequently asked questions</h2>
          </LandingAnimation>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              ["Apa saja fasilitas yang tersedia di JTI Sport Center?", "JTI Sport Center menyediakan lapangan futsal, gym, kolam renang, dan area parkir luas."],
              ["Bagaimana cara melakukan reservasi lapangan?", "Reservasi dapat dilakukan melalui website atau datang langsung ke resepsionis sport center."],
              ["Apakah tersedia layanan pelatih pribadi?", "Ya, tersedia pelatih pribadi untuk gym dan renang dengan biaya tambahan."],
              ["Berapa jam operasional sport center?", "Sport center buka setiap hari dari pukul 06.00 hingga 22.00 WIB."],
              ["Apakah tersedia program keanggotaan?", "Ya, tersedia berbagai paket keanggotaan bulanan dan tahunan dengan keuntungan khusus."],
            ].map(([q, a], i) => (
              <LandingAnimation key={i} delay={i * 0.1}>
                <FAQAnimation question={q} answer={a} />
              </LandingAnimation>
            ))}
          </div>
        </section>
      </MainLayout>
    </>
  );
}

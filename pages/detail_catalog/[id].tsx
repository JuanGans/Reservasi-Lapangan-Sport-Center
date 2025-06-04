import { useRouter } from "next/router";
import MainLayout from "@/layout/MainLayout";
import { useEffect, useState } from "react";
import Toast from "@/components/toast/Toast";
import { AnimatePresence, motion } from "framer-motion";
import LandingAnimation from "@/components/animation/LandingAnimation";

interface FieldType {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string;
  price_per_session: string;
  avg_rating?: number;
  total_review?: number;
}

export default function DetailCatalog() {
  const router = useRouter();
  const { id } = router.query;

  const [field, setField] = useState<FieldType | null>(null);
  const [allFields, setAllFields] = useState<FieldType[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [recommendationSeed, setRecommendationSeed] = useState(Math.random());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

  const sessions = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18.00 - 19.00",
    "19:00 - 20:00",
    "20:00 - 21.00",
    "21.00 - 22.00",
    "22.00 - 23.00",
    "23.00 - 24.00",
  ];

  useEffect(() => {
    if (id) {
      fetch(`/api/facilities/getFacilityById/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setField(data);
          setRecommendationSeed(Math.random());
          setSelectedDate(""); // 🧹 Reset tanggal
          setSelectedSessions([]); // 🧹 Reset sesi
        })
        .catch((err) => console.error("Gagal ambil data:", err));
    }
  }, [id]);

  useEffect(() => {
    fetch("/api/facilities/getAllFacilities")
      .then((res) => res.json())
      .then((data) => setAllFields(data))
      .catch((err) => console.error("Gagal ambil semua fasilitas:", err));
  }, []);

  const toggleSession = (session: string) => {
    setSelectedSessions((prev) => (prev.includes(session) ? prev.filter((s) => s !== session) : [...prev, session]));
  };

  const handleBooking = () => {
    if (!selectedDate) {
      setToast({ message: "Pilih tanggal booking terlebih dahulu.", type: "info" });
      return;
    }

    if (selectedSessions.length === 0) {
      setToast({ message: "Pilih setidaknya satu sesi terlebih dahulu.", type: "info" });
      return;
    }

    setShowLoginPopup(true);
  };

  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginPopup]);

  const isSessionDisabled = (sessionTime: string) => {
    if (!selectedDate) return false;

    const sessionStartHour = parseInt(sessionTime.split(":")[0]); // Misalnya 08 dari "08:00 - 09:00"
    const selected = new Date(selectedDate);
    const now = new Date();

    if (
      selected.toDateString() === now.toDateString() && // Jika tanggal = hari ini
      sessionStartHour <= now.getHours() // Dan jam sesi sudah lewat
    ) {
      return true;
    }

    return false;
  };

  // Reset sesi yang disabled saat tanggal berubah
  useEffect(() => {
    if (!selectedDate) return;

    setSelectedSessions((prev) => prev.filter((session) => !isSessionDisabled(session)));
  }, [selectedDate]);

  const formatTanggal = (iso: string) => {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  // Contoh: formatTanggal(selectedDate) → "21 Mei 2025"

  const recommended = allFields
    .filter((f) => f.id !== Number(id))
    .sort(() => recommendationSeed - 0.5)
    .slice(0, 3);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <MainLayout title="Detail Lapangan">
        {/* HERO SECTION */}
        {field ? (
          <section
            className="relative min-h-[300px] flex flex-col items-center justify-center bg-cover bg-center text-center text-white px-4"
            style={{ backgroundImage: `url(/assets/field/${field.field_image || "/assets/field/fallback.jpg"})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 mt-16">
              <LandingAnimation>
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{field.field_name}</h1>
              </LandingAnimation>
              <LandingAnimation delay={0.1}>
                <p className="mt-2 max-w-2xl text-white drop-shadow text-lg">{field.field_desc}</p>
              </LandingAnimation>
            </div>
          </section>
        ) : (
          <section className="relative min-h-[300px] flex flex-col items-center justify-center bg-blue-100 px-4">
            <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }} className="w-3/4 h-10 bg-gray-300 rounded mb-4" />
            <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }} className="w-2/3 h-6 bg-gray-200 rounded" />
          </section>
        )}

        {/* DETAIL SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-10 bg-blue-100">
          {field ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow">
              <div>
                <LandingAnimation delay={0.2}>
                  <img src={field.field_image ? `/assets/field/${field.field_image}` : "/assets/field/fallback.jpg"} alt={field.field_name} className="w-full h-[360px] object-cover rounded-lg" />
                </LandingAnimation>
                <LandingAnimation>
                  <button onClick={() => router.push("/catalog")} className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-sm cursor-pointer">
                    ← Kembali ke Catalog
                  </button>
                </LandingAnimation>
              </div>
              <div className="flex flex-col space-y-4">
                <LandingAnimation delay={0.2}>
                  <h2 className="text-3xl font-bold text-blue-900">{field.field_name}</h2>
                </LandingAnimation>
                <LandingAnimation delay={0.2}>
                  <p className="text-gray-700 text-base">{field.field_desc}</p>
                </LandingAnimation>
                <LandingAnimation delay={0.2}>
                  <p className="text-xl font-semibold text-blue-800">Rp. {parseInt(field.price_per_session).toLocaleString()} / sesi</p>
                </LandingAnimation>
                <LandingAnimation delay={0.2}>
                  <p className="text-yellow-500 text-lg">⭐ {field.avg_rating ?? "-"} / 5</p>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
                    <input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 cursor-pointer"
                    />
                  </div>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <p className={`text-sm ${selectedDate ? "text-gray-500" : "text-gray-400 italic"}`}>Tanggal dipilih: {selectedDate ? formatTanggal(selectedDate) : "Belum ada"}</p>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <p className="text-sm font-medium text-gray-700">Pilih Sesi</p>
                </LandingAnimation>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {sessions.map((session, idx) => {
                    const disabled = isSessionDisabled(session);

                    return (
                      <div key={session}>
                        <LandingAnimation delay={idx * 0.1}>
                          <button
                            onClick={() => toggleSession(session)}
                            disabled={disabled}
                            className={`w-full px-4 py-2 rounded border transition text-sm cursor-pointer ${
                              disabled ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : selectedSessions.includes(session) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 hover:bg-blue-50"
                            }`}
                          >
                            {session}
                          </button>
                        </LandingAnimation>
                      </div>
                    );
                  })}
                </div>

                <LandingAnimation>
                  <p className="text-lg font-semibold text-gray-800 mt-4">Total: Rp. {field ? (parseInt(field.price_per_session) * selectedSessions.length).toLocaleString() : "0"}</p>
                </LandingAnimation>

                <button onClick={handleBooking} className="bg-blue-600 text-white py-3 mt-2 rounded-md hover:bg-blue-700 transition text-lg cursor-pointer">
                  <LandingAnimation>Booking Sekarang</LandingAnimation>
                </button>
              </div>
            </div>
          ) : (
            <>
              {!field && (
                <section className="max-w-7xl mx-auto px-4 py-10 bg-blue-100">
                  <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow"
                  >
                    <div className="w-full h-[360px] bg-gray-300 rounded-lg animate-pulse" />
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                      <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse mt-6" />
                      <div className="h-10 bg-gray-400 rounded w-1/3 animate-pulse" />
                    </div>
                  </motion.div>
                </section>
              )}
            </>
          )}
        </section>

        {/* RECOMMENDED FIELDS */}
        <section className="max-w-7xl mx-auto px-4 pb-10 bg-blue-100">
          <LandingAnimation>
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Lapangan Lainnya</h2>
          </LandingAnimation>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommended.length > 0
              ? recommended.map((field, idx) => (
                  <LandingAnimation key={idx} delay={idx * 0.1}>
                    <div key={field.id} onClick={() => router.push(`/detail_catalog/${field.id}`)} className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                      <img src={field.field_image ? `/assets/field/${field.field_image}` : "/assets/field/fallback.jpg"} alt={field.field_name} className="w-full h-40 object-cover rounded mb-3" />
                      <h3 className="text-blue-900 font-semibold text-lg mb-1">{field.field_name}</h3>
                      <p className="text-gray-600 text-sm">{field.field_desc}</p>
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                        <span>Rp. {parseInt(field.price_per_session).toLocaleString()}</span>
                        <span>⭐ {field.avg_rating ? field.avg_rating.toFixed(1) : "-"}</span>
                      </div>
                    </div>
                  </LandingAnimation>
                ))
              : [1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }}
                    className="bg-white p-4 rounded-lg shadow space-y-3 animate-pulse"
                  >
                    <div className="w-full h-40 bg-gray-300 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </motion.div>
                ))}
          </div>
        </section>

        {/* POPUP LOGIN MODAL */}
        <AnimatePresence>
          {showLoginPopup && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                <button onClick={() => setShowLoginPopup(false)} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg cursor-pointer">
                  ✕
                </button>
                <h2 className="text-xl font-bold text-blue-900 mb-2">Anda Belum Login</h2>
                <p className="text-gray-600 mb-4 text-sm">Silakan login terlebih dahulu untuk melanjutkan proses booking.</p>
                <button onClick={() => router.push("/login")} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
                  Login Sekarang
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MainLayout>
    </>
  );
}

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
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00",
    "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 24:00",
  ];

  // Fetch single facility detail when id changes
  useEffect(() => {
    if (id) {
      fetch(`/api/facilities/getFacilityById/${id}`)
        .then(res => res.json())
        .then(data => {
          setField(data);
          setRecommendationSeed(Math.random());
          setSelectedDate("");
          setSelectedSessions([]);
        })
        .catch(err => console.error("Failed to fetch facility:", err));
    }
  }, [id]);

  // Fetch all facilities once on mount
  useEffect(() => {
    fetch("/api/facilities/getAllFacilities")
      .then(res => res.json())
      .then(data => setAllFields(data))
      .catch(err => console.error("Failed to fetch all facilities:", err));
  }, []);

  // Toggle session selection
  const toggleSession = (session: string) => {
    setSelectedSessions(prev =>
      prev.includes(session) ? prev.filter(s => s !== session) : [...prev, session]
    );
  };

  // Booking handler with validation
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

  // Disable body scroll when popup shows
  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginPopup]);

  // Disable sessions that are in the past for today
  const isSessionDisabled = (sessionTime: string) => {
    if (!selectedDate) return false;

    const sessionStartHour = parseInt(sessionTime.split(":")[0]);
    const selected = new Date(selectedDate);
    const now = new Date();

    return (
      selected.toDateString() === now.toDateString() &&
      sessionStartHour <= now.getHours()
    );
  };

  // Clear disabled sessions when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSessions(prev => prev.filter(session => !isSessionDisabled(session)));
  }, [selectedDate]);

  // Format date string to Indonesian date format
  const formatTanggal = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // Recommended fields (exclude current, shuffle by seed, take 3)
  const recommended = allFields
    .filter(f => f.id !== Number(id))
    .sort(() => recommendationSeed - 0.5)
    .slice(0, 3);

  return (
    <>
      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <MainLayout title="Detail Lapangan">
        {/* Hero Section */}
        {field ? (
          <section
            className="relative min-h-[300px] flex flex-col items-center justify-center bg-cover bg-center text-center text-white px-4"
            style={{ backgroundImage: `url(${field.field_image || "/assets/field/fallback.jpg"})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 mt-16">
              <LandingAnimation>
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{field.field_name}</h1>
              </LandingAnimation>
              <LandingAnimation delay={0.1}>
                <p className="mt-2 max-w-2xl drop-shadow text-lg">{field.field_desc}</p>
              </LandingAnimation>
            </div>
          </section>
        ) : (
          <section className="relative min-h-[300px] flex flex-col items-center justify-center bg-blue-100 px-4">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }}
              className="w-3/4 h-10 bg-gray-300 rounded mb-4"
            />
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatType: "reverse" }}
              className="w-2/3 h-6 bg-gray-200 rounded"
            />
          </section>
        )}

        {/* Detail Section */}
        <section className="max-w-7xl mx-auto px-4 py-10 bg-blue-100">
          {field ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow">
              <div>
                <LandingAnimation delay={0.2}>
                  <img
                    src={field.field_image || "/assets/field/fallback.jpg"}
                    alt={field.field_name}
                    className="w-full h-[360px] object-cover rounded-lg"
                  />
                </LandingAnimation>
                <LandingAnimation>
                  <button
                    onClick={() => router.push("/catalog")}
                    className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-sm cursor-pointer"
                  >
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
                  <p className="text-xl font-semibold text-blue-800">
                    Rp. {parseInt(field.price_per_session).toLocaleString()} / sesi
                  </p>
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
                      onChange={e => setSelectedDate(e.target.value)}
                      className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 cursor-pointer"
                    />
                  </div>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <p className={`text-sm ${selectedDate ? "text-gray-500" : "text-gray-400 italic"}`}>
                    Tanggal yang dipilih:{" "}
                    {selectedDate ? formatTanggal(selectedDate) : "Belum memilih tanggal"}
                  </p>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <div>
                    <p className="mb-2 font-semibold">Pilih Sesi (Jam)</p>
                    <div className="grid grid-cols-4 gap-2">
                      {sessions.map(session => {
                        const disabled = isSessionDisabled(session);
                        const selected = selectedSessions.includes(session);
                        return (
                          <button
                            key={session}
                            onClick={() => !disabled && toggleSession(session)}
                            disabled={disabled}
                            className={`rounded px-3 py-1 text-sm
                              ${
                                disabled
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white cursor-pointer"
                              }`}
                          >
                            {session}
                          </button>
                        );
                      })}
                    </div>
                    {selectedSessions.length > 0 && (
                      <p className="mt-1 text-sm text-blue-700">
                        Durasi: {selectedSessions.length} jam
                      </p>
                    )}
                  </div>
                </LandingAnimation>

                <LandingAnimation delay={0.2}>
                  <p className="text-lg font-bold text-blue-900 mt-4">
                    Total Harga: Rp.{" "}
                    {field.price_per_session
                      ? (
                          selectedSessions.length * parseInt(field.price_per_session)
                        ).toLocaleString()
                      : "0"}
                  </p>
                </LandingAnimation>

                <LandingAnimation delay={0.3}>
                  <button
                    onClick={handleBooking}
                    className="mt-6 bg-blue-600 text-white py-3 rounded w-full hover:bg-blue-700 transition"
                  >
                    Booking Sekarang
                  </button>
                </LandingAnimation>
              </div>
            </div>
          ) : (
            <div className="text-center p-10">Memuat detail lapangan...</div>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h3 className="text-2xl font-semibold mb-6 text-blue-900">
            Rekomendasi Lapangan Lainnya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map(field => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg"
                onClick={() => router.push(`/catalog/detail/${field.id}`)}
              >
                <img
                  src={field.field_image || "/assets/field/fallback.jpg"}
                  alt={field.field_name}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 font-semibold text-blue-900">{field.field_name}</h4>
                <p className="text-sm text-gray-600">{field.field_desc.slice(0, 80)}...</p>
                <p className="mt-1 text-blue-700 font-semibold">
                  Rp. {parseInt(field.price_per_session).toLocaleString()} / sesi
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </MainLayout>

      {/* Login Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 max-w-md w-full text-center"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                Silakan login terlebih dahulu
              </h2>
              <p className="mb-6 text-gray-700">Untuk melakukan booking lapangan, Anda harus login.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    router.push("/login");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { Facility } from "@/types/facility";
import { sessions } from "@/utils/session";
import PopupBooking from "@/components/booking/PopupBooking";
import ReviewSection from "@/components/reviews/ReviewSection";
import { Review } from "@/types/review";

const DetailCatalogPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showPopup, setShowPopup] = useState(false);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [allFields, setAllFields] = useState<Facility[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [recommendationSeed, setRecommendationSeed] = useState(Math.random());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const today = new Date().toISOString().split("T")[0];
  const [bookedSessions, setBookedSessions] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate || !facility?.id) return;

    const fetchBookedSessions = async () => {
      try {
        const res = await fetch("/api/bookings/getAllBookings");
        const data = await res.json();

        const sameDayBookings = data.filter((b: any) => b.facilityId === facility.id && new Date(b.booking_date).toISOString().split("T")[0] === selectedDate);

        const booked: string[] = [];

        sameDayBookings.forEach((b: any) => {
          b.sessions.forEach((s: any) => {
            const start = new Date(s.start_time);
            const end = new Date(s.end_time);

            const formatted = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;
            booked.push(formatted);
          });
        });

        setBookedSessions(booked);
      } catch (err) {
        console.error("Gagal mengambil data booking:", err);
      }
    };

    fetchBookedSessions();
  }, [selectedDate, facility]);

  useEffect(() => {
    async function fetchFacilityDetail() {
      if (!id) return;

      try {
        const res = await fetch(`/api/facilities/getFacilityById/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data lapangan");
        const data = await res.json();
        setFacility(data);
        setRecommendationSeed(Math.random());
      } catch (error) {
        console.error(error);
        setToast({ message: "Gagal memuat data lapangan", type: "error" });
      }
    }

    fetchFacilityDetail();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  useEffect(() => {
    fetch("/api/facilities/getAllFacilities")
      .then((res) => res.json())
      .then((data) => setAllFields(data))
      .catch((err) => console.error("Gagal ambil semua fasilitas:", err));
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews/getAllReviewsByFacilitiesId/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error("Expected an array, got:", data);
      }
    };

    fetchReviews();
  }, [id]);

  const toggleSession = (session: string) => {
    setSelectedSessions((prev) => (prev.includes(session) ? prev.filter((s) => s !== session) : [...prev, session]));
  };

  const isSessionDisabled = (sessionTime: string) => {
    if (!selectedDate) return false;

    const sessionStartHour = parseInt(sessionTime.split(":")[0]);
    const selected = new Date(selectedDate);
    const now = new Date();

    const alreadyBooked = bookedSessions.includes(sessionTime);

    if ((selected.toDateString() === now.toDateString() && sessionStartHour <= now.getHours()) || alreadyBooked) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSessions((prev) => prev.filter((session) => !isSessionDisabled(session)));
  }, [selectedDate]);

  const formatTanggal = (iso: string) => {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const recommended = allFields
    .filter((f) => f.id !== Number(id))
    .sort(() => recommendationSeed - 0.5)
    .slice(0, 3);

  const handleAddBooking = async ({
    facilityId,
    booking_date,
    price_per_session,
    selectedSessions,
    router,
    setToast,
  }: {
    facilityId: number;
    booking_date: string;
    price_per_session: number;
    selectedSessions: string[];
    router: any;
    setToast: (val: { message: string; type: "success" | "error" | "info" }) => void;
  }) => {
    try {
      const sessionData = selectedSessions.map((label) => {
        // Jika label = "08:00 - 09:00", ambil jam mulai dan selesai
        const [startLabel, endLabel] = label.split(" - ");
        const startDate = new Date(`${booking_date}T${startLabel}:00`);
        const endDate = new Date(`${booking_date}T${endLabel}:00`);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Format waktu sesi tidak valid");
          // setToast({ message: "Tidak bisa memilh sesi yang berbeda atau beruntun", type: "error" });
        }

        return {
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
        };
      });

      const res = await fetch("/api/bookings/addBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          facilityId,
          booking_date,
          total_price: price_per_session * selectedSessions.length,
          sessions: sessionData,
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat booking");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      router.push(`/member/booking`);
    } catch (err) {
      console.error("Booking gagal:", err);
      setToast({ message: "Gagal melakukan booking", type: "error" });
    }
  };

  if (!facility) {
    return (
      <DashboardLayout title="Detail Lapangan">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title={facility.field_name}>
        <div className="max-w-4xl mx-auto mt-6">
          <button onClick={() => router.back()} className="flex items-center text-blue-900 hover:text-blue-700 mb-6 cursor-pointer">
            <i className="fas fa-arrow-left mr-2"></i>
            Kembali
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={facility.field_image ? `/assets/field/${facility.field_image}` : "/assets/field/fallback.jpg"} alt={facility.field_name} className="w-full h-96 object-cover" />

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-blue-900">{facility.field_name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    <i className="fas fa-star"></i>
                  </span>
                  <span className="font-medium text-gray-500">{facility.avg_rating ? facility.avg_rating.toFixed(1) : "-"}</span>
                  <span className="text-gray-500">({facility.total_review || 0} ulasan)</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Deskripsi</h2>
                <p className="text-gray-700 leading-relaxed">{facility.field_desc}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onInput={(e) => setSelectedDate((e.target as HTMLInputElement).value)} // tambahan supaya lebih responsif
                    className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 cursor-pointer"
                  />
                </div>

                <p className={`text-sm ${selectedDate ? "text-gray-500" : "text-gray-400 italic"}`}>Tanggal dipilih: {selectedDate ? formatTanggal(selectedDate) : "Belum ada"}</p>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pilih Sesi</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {sessions.map((session) => {
                      const disabled = isSessionDisabled(session);
                      return (
                        <button
                          key={session}
                          onClick={() => toggleSession(session)}
                          disabled={disabled}
                          className={`w-full px-4 py-2 rounded border transition text-sm cursor-pointer ${
                            disabled ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" : selectedSessions.includes(session) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 hover:bg-blue-50"
                          }`}
                        >
                          {session}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Total Harga</h3>
                    <p className="text-2xl font-bold text-blue-700">Rp {parseInt(facility.price_per_session) * selectedSessions.length || 0}</p>
                  </div>
                  <button
                    onClick={() => setShowPopup(true)}
                    disabled={!selectedDate || selectedSessions.length === 0}
                    className={`bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-color cursor-pointer ${!selectedDate || selectedSessions.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                  >
                    Pesan Sekarang
                  </button>
                  <PopupBooking
                    isOpen={showPopup}
                    onClose={() => setShowPopup(false)}
                    onConfirm={() =>
                      handleAddBooking({
                        facilityId: facility.id,
                        booking_date: selectedDate,
                        price_per_session: parseInt(facility.price_per_session),
                        selectedSessions,
                        router,
                        setToast,
                      })
                    }
                    facilityName={facility.field_name}
                    selectedDate={selectedDate}
                    selectedSessions={selectedSessions}
                    totalPrice={parseInt(facility.price_per_session) * selectedSessions.length}
                  />
                </div>
              </div>
            </div>
          </div>

          <ReviewSection reviews={reviews} />

          {/* Rekomendasi Lapangan */}
          <div className="my-10">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Lapangan Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map((field) => (
                <div key={field.id} onClick={() => router.push(`/member/detail_catalog/${field.id}`)} className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                  <img src={field.field_image ? `/assets/field/${field.field_image}` : "/assets/field/fallback.jpg"} alt={field.field_name} className="w-full h-40 object-cover rounded mb-3" />
                  <h3 className="text-blue-900 font-semibold text-lg mb-1">{field.field_name}</h3>
                  <p className="text-gray-600 text-sm">{field.field_desc}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                    <span>Rp. {parseInt(field.price_per_session).toLocaleString()}</span>
                    <span>⭐ {field.avg_rating ? field.avg_rating.toFixed(1) : "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DetailCatalogPage;

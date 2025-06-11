// PRRR
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import Image from "next/image";

interface Facility {
  id: number;
  field_name: string;
  field_image: string;
  price_per_session: number;
}

const hours = Array.from({ length: 24 }, (_, i) => {
  const start = i.toString().padStart(2, "0") + ":00";
  const end = ((i + 1) % 24).toString().padStart(2, "0") + ":00";
  return { start, end };
});

export default function BookingPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [userName, setUserName] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const duration = selectedSlots.length;
  const totalPrice = selectedFacility ? duration * selectedFacility.price_per_session : 0;

  useEffect(() => {
    // Ambil data user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserName(data.fullname))
      .catch(() => setUserName(""));

    // Ambil data lapangan
    fetch("/api/facilities/getAllFacilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data));
  }, []);

  const handleSlotToggle = (slot: string) => {
    setSelectedSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()));
  };

  const handleSubmit = async () => {
    if (!selectedFacility || !selectedDate || selectedSlots.length === 0) {
      setToast({ message: "Lengkapi semua field!", type: "error" });
      return;
    }

    const payload = {
      userId: 1, // 🔧 ganti dengan user ID asli dari session kalau ada
      userName: userName,
      courtId: selectedFacility.id,
      courtName: selectedFacility.field_name,
      bookingDate: selectedDate,
      durationHours: duration,
      totalPrice: totalPrice,
      timeSlots: selectedSlots.map((slot) => {
        const iso = new Date(`${selectedDate}T${slot}:00`).toISOString();
        return iso;
      }),
    };

    const response = await fetch("/api/bookings/addBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setToast({ message: "Reservasi berhasil!", type: "success" });
      setSelectedDate("");
      setSelectedFacility(null);
      setSelectedSlots([]);
    } else {
      setToast({ message: "Gagal melakukan reservasi", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Reservasi Lapangan">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-900">Reservasi Lapangan Futsal</h1>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Nama User</label>
            <input type="text" value={userName} readOnly className="w-full px-4 py-2 border rounded-md bg-gray-100 text-black" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Pilih Lapangan</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => setSelectedFacility(facility)}
                  className={`cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${selectedFacility?.id === facility.id ? "ring-2 ring-green-500" : ""}`}
                >
                  <Image src={`/assets/field/${facility.field_image}`} alt={facility.field_name} width={300} height={200} className="object-cover w-full h-32" />
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-600 text-sm">{facility.field_name}</h3>
                    <p className="text-xs text-gray-600">Rp {facility.price_per_session.toLocaleString("id-ID")}/sesi</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Booking</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-2 border rounded-md text-black" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Sesi / Pilih Jam</label>
            <div className="grid grid-cols-6 gap-2">
              {hours.map(({ start, end }) => {
                const isSelected = selectedSlots.includes(start);
                return (
                  <button key={start} type="button" onClick={() => handleSlotToggle(start)} className={`text-sm border px-2 py-1 rounded ${isSelected ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-green-100"}`}>
                    {start} - {end}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-lg font-semibold text-gray-800">Durasi: {duration} jam</div>
          <div className="text-lg font-semibold text-gray-800">Total Harga: Rp {totalPrice.toLocaleString("id-ID")}</div>

          <button onClick={handleSubmit} className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
            Reservasi Sekarang
          </button>
        </div>
      </DashboardLayout>
    </>
  );
}

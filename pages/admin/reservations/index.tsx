import Link from "next/link";
import { useState, useEffect } from "react";

interface Booking {
  id: number;
  court: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  phone_number: string;
  time_slots?: string[];
}

const pricePerHour = 70000;

const hours = Array.from({ length: 24 }, (_, i) => {
  const start = i.toString().padStart(2, "0") + ":00";
  const endHour = ((i + 1) % 24).toString().padStart(2, "0") + ":00";
  return { start, end: endHour };
});

function TimeSlotsMultiSelect({
  selectedSlots,
  setSelectedSlots,
}: {
  selectedSlots: string[];
  setSelectedSlots: (slots: string[]) => void;
}) {
  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot].sort());
    }
  };

  return (
    <div className="grid grid-cols-6 gap-3">
      {hours.map(({ start, end }) => {
        const label = `${start} - ${end}`;
        const isSelected = selectedSlots.includes(start);
        return (
          <button
            key={start}
            type="button"
            onClick={() => toggleSlot(start)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition select-none
              ${isSelected ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Reservations() {
  const [court, setCourt] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const duration = selectedSlots.length;
  const totalPrice = duration * pricePerHour;

  const handleReserve = async () => {
    if (!court || !date || duration === 0 || !phoneNumber) {
      alert("Harap lengkapi semua field dan pilih jam!");
      return;
    }

    const sortedSlots = [...selectedSlots].sort();
    const time = sortedSlots[0];

    setLoading(true);
    const response = await fetch("/api/bookings/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        court,
        date,
        time,
        duration,
        price: totalPrice,
        phone_number: phoneNumber,
        time_slots: sortedSlots,
      }),
    });
    setLoading(false);

    if (response.ok) {
      alert("Reservasi berhasil!");
      setCourt("");
      setDate("");
      setSelectedSlots([]);
      setPhoneNumber("");
    } else {
      alert("Gagal melakukan reservasi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Reservasi Lapangan Futsal
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <label className="block mb-2 font-semibold text-gray-700">
          Nama Lapangan
        </label>
        <input
          type="text"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          placeholder="Masukkan nama lapangan"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
        />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
        />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">
          Pilih Jam (Bisa lebih dari 1)
        </label>
        <TimeSlotsMultiSelect
          selectedSlots={selectedSlots}
          setSelectedSlots={setSelectedSlots}
        />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">
          Nomor Telepon
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Masukkan nomor telepon"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
        />

        <div className="mt-6 text-lg font-semibold text-gray-800">
          Durasi: {duration} jam
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Total Harga: Rp {totalPrice.toLocaleString("id-ID")}
        </div>

        <button
          onClick={handleReserve}
          disabled={loading}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? "Memproses..." : "Reservasi Sekarang"}
        </button>

        {/* Tombol menuju daftar reservasi */}
        <Link href="/admin/reservations/list">
          <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Reservations List
          </button>
        </Link>
      </div>
    </div>
  );
}

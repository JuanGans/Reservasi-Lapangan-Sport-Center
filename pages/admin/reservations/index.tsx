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
  time_slots?: string[]; // optional karena data lama mungkin belum ada
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
              ${isSelected ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}
            `}
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
  const [bookings, setBookings] = useState<Booking[]>([]);

  const duration = selectedSlots.length;
  const totalPrice = duration * pricePerHour;

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/get-all");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
      fetchBookings();
    } else {
      alert("Gagal melakukan reservasi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Reservasi Lapangan Futsal</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <label className="block mb-2 font-semibold text-gray-700">Nama Lapangan</label>
        <input
          type="text"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          placeholder="Masukkan nama lapangan"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
        />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
        />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">Pilih Jam (Bisa lebih dari 1)</label>
        <TimeSlotsMultiSelect selectedSlots={selectedSlots} setSelectedSlots={setSelectedSlots} />

        <label className="block mt-4 mb-2 font-semibold text-gray-700">Nomor Telepon</label>
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
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Daftar Reservasi</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada reservasi</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-md shadow mb-4 flex justify-between items-center text-black"
          >
            <div>
              <p className="font-bold text-lg">{b.court}</p>

              {/* Tampilkan slot waktu per grup */}
              {(() => {
                const timeSlots = b.time_slots || [];
                const slotHours = timeSlots
                  .map((t) => parseInt(t.split(":")[0], 10))
                  .sort((a, b) => a - b);

                const grouped: number[][] = [];
                let group: number[] = [];

                for (let i = 0; i < slotHours.length; i++) {
                  if (i === 0 || slotHours[i] === slotHours[i - 1] + 1) {
                    group.push(slotHours[i]);
                  } else {
                    grouped.push(group);
                    group = [slotHours[i]];
                  }
                }
                if (group.length) grouped.push(group);

                const formatTime = (h: number) => h.toString().padStart(2, "0") + ":00";

                return grouped.map((g, i) => {
                  const start = g[0];
                  const end = (g[g.length - 1] + 1) % 24;
                  return (
                    <p key={i}>
                      {new Date(b.date).toLocaleDateString("id-ID")} - {formatTime(start)} - {formatTime(end)} ({g.length} jam)
                    </p>
                  );
                });
              })()}

              <p className="font-semibold text-green-600">Rp {b.price.toLocaleString("id-ID")}</p>
              <p>Status: {b.status}</p>
              <p>📞 {b.phone_number}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

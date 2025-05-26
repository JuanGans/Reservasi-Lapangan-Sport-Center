import { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Booking {
  id: number;
  court: string;
  date: string | null;
  time: string;
  status: string;
  phone_number: string;
  duration: number;
  price: number;
  time_slots: string[];
}


const PAGE_SIZE = 10;

export default function ReservationTable() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal hapus
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterDate, setFilterDate] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/bookings/get-all")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  // Filtered Data based on status and date
  const filteredData = useMemo(() => {
    return data.filter((b) => {
      let statusMatch = filterStatus === "All" || b.status === filterStatus;
      let dateMatch =
        !filterDate ||
        (b.date && new Date(b.date).toISOString().slice(0, 10) === filterDate);
      return statusMatch && dateMatch;
    });
  }, [data, filterStatus, filterDate]);

  // Pagination slice
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch("/api/bookings/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error("Update gagal");

      setData((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      toast.success("Status berhasil diubah");
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const openModal = (id: number) => {
    setSelectedId(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (selectedId === null) return;

    try {
      const res = await fetch("/api/bookings/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId }),
      });

      if (!res.ok) throw new Error("Gagal hapus");

      setData((prev) => prev.filter((b) => b.id !== selectedId));
      toast.success("Reservasi berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus reservasi");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700">
        Daftar Reservasi Lapangan
      </h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap items-center justify-start">
  <span className="font-semibold">Filter:</span>
  <select
    className="border rounded px-3 py-1"
    value={filterStatus}
    onChange={(e) => {
      setFilterStatus(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="All">Semua Status</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Done">Done</option>
    <option value="Canceled">Canceled</option>
  </select>
</div>


      {loading ? (
        <p className="text-center text-blue-600">Memuat data...</p>
      ) : (
        <>
          <div className="overflow-auto rounded-xl shadow-lg border bg-white">
            <table className="min-w-full text-sm text-center border-collapse">
              <thead className="bg-blue-100 text-gray-700 font-semibold">
                <tr>
                     <th className="p-3 border">No.</th>
                  <th className="p-3 border">Lapangan</th>
                  <th className="p-3 border">Tanggal</th>
                  <th className="p-3 border">Slot Waktu</th>
                  <th className="p-3 border">Durasi</th>
                  <th className="p-3 border">Total Harga</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Ubah Status</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((booking, idx) => (
                  <tr key={booking.id} className="hover:bg-blue-50">
                    <td className="border p-2">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="border p-2">{booking.court}</td>
                    <td className="border p-2">
                      {booking.date
                        ? new Date(booking.date).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="border p-2 text-left">
                      {booking.time_slots.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {mergeTimeSlots(booking.time_slots).map((slot, idx) => (
                            <li key={idx}>{slot}</li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border p-2">{booking.duration} jam</td>
                    <td className="border p-2">
                      Rp{booking.price.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`border p-2 font-semibold ${
                        booking.status === "Confirmed"
                          ? "text-green-600"
                          : booking.status === "Pending"
                          ? "text-yellow-600"
                          : booking.status === "Canceled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </td>
                    <td className="border p-2">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value)
                        }
                        className="border px-2 py-1 rounded-md w-full"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Done">Done</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => openModal(booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal konfirmasi hapus */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-white bg-opacity-30 flex justify-center items-start z-50"
      >
        <h2 className="text-xl font-semibold mb-4 text-center text-red-600">
          Konfirmasi Hapus
        </h2>
        <p className="mb-6 text-center text-black">
          Apakah Anda yakin ingin menghapus reservasi ini?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Hapus
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Fungsi gabung slot waktu (sama seperti sebelumnya)
function mergeTimeSlots(slots: string[]): string[] {
  const sorted = slots
    .map((time) => {
      const [h, m] = time.split(":").map(Number);
      return { hour: h, minute: m };
    })
    .sort((a, b) => a.hour - b.hour || a.minute - b.minute);

  const result: { start: number; end: number }[] = [];
  let start = sorted[0]?.hour;
  let end = start;

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i].hour;
    if (curr === end + 1) {
      end = curr;
    } else {
      result.push({ start, end });
      start = curr;
      end = curr;
    }
  }
  if (start !== undefined) result.push({ start, end });

  return result.map(
    ({ start, end }) =>
      `${String(start).padStart(2, "0")}.00 - ${String(end + 1).padStart(2, "0")}.00`
  );
}

// components/BookingTable.tsx
import React from "react";

type BookingSessions = {
  id: number;
  start_time: string;
  end_time: string;
};

type Booking = {
  id: number;
  booking_date: string;
  booking_status: "pending" | "paid" | "canceled" | "completed";
  durasi_jam?: number;
  total_harga?: number;
  user?: {
    name: string;
  };
  facility?: {
    field_name: string;
  };
  sessions?: BookingSessions[];
};


type BookingTableProps = {
  bookings: Booking[];
  filterStatus: "all" | Booking["booking_status"];
};

const BookingTable: React.FC<BookingTableProps> = ({ bookings, filterStatus }) => {
  const handleDetailClick = (id: number) => {
    // implement detail logic here, e.g. routing or modal
    console.log("Detail clicked for booking id:", id);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.booking_status === filterStatus;
  });

  return (
    <div className="mt-6 bg-white rounded-md shadow-md p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">Riwayat Booking</h2>
      <table className="min-w-full border-collapse border border-gray-300 table-auto">
      <thead className="bg-gray-50">
  <tr>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">No</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Nama User</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Nama Lapangan</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Tanggal Booking</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Sesi</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Durasi (Jam)</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Status</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Total Harga</th>
    <th className="border border-gray-300 p-2 text-gray-500 whitespace-nowrap">Aksi</th>
  </tr>
</thead>

<tbody>
  {filteredBookings.length === 0 ? (
    <tr>
      <td colSpan={9} className="border border-gray-300 px-2 py-4 text-center text-gray-500">
        Tidak ada booking
      </td>
    </tr>
  ) : (
    filteredBookings.map((booking, index) => (
      <tr key={booking.id} className="odd:bg-white even:bg-gray-50">
        <td className="border border-gray-300 p-2 text-gray-700 whitespace-nowrap">{index + 1}</td>
        <td className="border border-gray-300 p-2 text-gray-700">{booking.user?.name || "-"}</td>
        <td className="border border-gray-300 p-2 text-gray-700">{booking.facility?.field_name || "-"}</td>
        <td className="border border-gray-300 p-2 text-gray-700 text-center whitespace-nowrap">
          {new Date(booking.booking_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-center">
          {booking.sessions && booking.sessions.length > 0 ? (
            booking.sessions.map((session) => (
              <div key={session.id} className="whitespace-nowrap">
                {new Date(session.start_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(session.end_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            ))
          ) : (
            <span>-</span>
          )}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-center whitespace-nowrap">
          {booking.durasi_jam ?? "-"}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 capitalize text-center whitespace-nowrap">
          {booking.booking_status}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-right whitespace-nowrap">
          {booking.total_harga !== undefined ? `Rp ${booking.total_harga.toLocaleString("id-ID")}` : "-"}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-center flex justify-center whitespace-nowrap">
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded cursor-pointer whitespace-nowrap"
            onClick={() => handleDetailClick(booking.id)}
          >
            <i className="fas fa-eye"></i> Lihat Detail
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
};

export default BookingTable;

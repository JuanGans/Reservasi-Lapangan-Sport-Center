// components/dashboard/BookingTable.tsx
import React from "react";

const BookingTable: React.FC<{ bookings: any[] }> = ({ bookings }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6">ID</th>
          <th className="py-3 px-6">User</th>
          <th className="py-3 px-6">Lapangan</th>
          <th className="py-3 px-6">Tanggal</th>
          <th className="py-3 px-6">Sesi (Jam)</th>
          <th className="py-3 px-6">Status</th>
          <th className="py-3 px-6">Total</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => {
          const start = b.sessions?.[0]?.start_time ? new Date(b.sessions[0].start_time) : null;
          const end = b.sessions?.[b.sessions.length - 1]?.end_time ? new Date(b.sessions[b.sessions.length - 1].end_time) : null;
          const durasi = start && end ? `${start.getHours()}:00 - ${end.getHours() + 1}:00` : "-";

          return (
            <tr key={b.id} className="border-b border-gray-200 hover:bg-gray-50 text-gray-600">
              <td className="py-3 px-6">{b.id}</td>
              <td className="py-3 px-6">{b.user?.username || "-"}</td>
              <td className="py-3 px-6">{b.facility?.field_name || "-"}</td>
              <td className="py-3 px-6">{new Date(b.booking_date).toLocaleDateString()}</td>
              <td className="py-3 px-6">{durasi}</td>
              <td
                className={`py-3 px-6 font-semibold ${
                  b.booking_status === "paid"
                    ? "text-green-600"
                    : b.booking_status === "pending"
                    ? "text-yellow-600"
                    : b.booking_status === "canceled"
                    ? "text-red-600"
                    : b.booking_status === "expired"
                    ? "text-gray-400"
                    : b.booking_status === "completed"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {b.booking_status.charAt(0).toUpperCase() + b.booking_status.slice(1)}
              </td>
              <td className="py-3 px-6">Rp. {b.total_price.toLocaleString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default BookingTable;

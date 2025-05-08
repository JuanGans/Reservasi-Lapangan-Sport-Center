import React from "react";
import Event from "./Event";
import Calendar from "./Calendar";

interface Booking {
  id: string;
  name: string;
  orderDate: string;
  orderTime: string;
  finishDate: string;
  finishTime: string;
  status: string;
}

interface BookingTableProps {
  bookings: Booking[];
  role: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, role }) => {
  return (
    // BOOKING TABLE DI DASHBOARD ADMIN
    <>
      {role === "Admin" && (
        <section className="bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 font-bold text-lg">Riwayat Pemesanan</h2>
            <i className="fas fa-handshake text-gray-700 text-lg"></i>
          </div>
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#0c3a66] text-white text-[13px] font-semibold">
                <th className="py-2 px-4 text-left">No</th>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Tgl. Pesan</th>
                <th className="py-2 px-4 text-left">Tgl. Selesai</th>
                <th className="py-2 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className={index % 2 === 0 ? "bg-[#d9edf7]" : ""}>
                  <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">{booking.id}</td>
                  <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">{booking.name}</td>
                  <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">
                    {booking.orderDate}
                    <br />
                    <span className="bg-[#f0f7d8] text-[10px] font-semibold p-1 rounded leading-none inline-block text-[#7a7a00]">{booking.orderTime}</span>
                  </td>
                  <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">
                    {booking.finishDate}
                    <br />
                    <span className="bg-[#f0f7d8] text-[10px] font-semibold p-1 rounded leading-none inline-block text-[#7a7a00]">{booking.finishTime}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-[#0c3a66] text-white text-[13px] font-semibold rounded px-4 py-1 hover:bg-[#0a2e52] transition-colors duration-200 cursor-pointer">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* BOOKING TABLE DI DASHBOARD User */}
      {/* Content grid */}
      {role === "User" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Riwayat Pemesanan Satu User */}
          <section className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-900 font-bold text-lg">Riwayat Pemesanan</h2>
              <i className="fas fa-handshake text-gray-700 text-lg"></i>
            </div>
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#0c3a66] text-white text-[13px] font-semibold">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Tgl. Selesai</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const statusText = booking.status === "Belum Selesai" ? "Belum Selesai" : "Selesai";
                  const statusColor = booking.status === "Belum Selesai" ? "bg-[#EF4444]" : "bg-[#22C55E]";

                  return (
                    <tr key={booking.id} className={index % 2 === 0 ? "bg-[#d9edf7]" : ""}>
                      <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">{booking.id}</td>
                      <td className="py-3 px-4 text-[13px] font-normal text-[#0c3a66]">
                        {booking.finishDate}
                        <br />
                        <span className="bg-[#f0f7d8] text-[10px] font-semibold p-1 rounded leading-none inline-block text-[#7a7a00]">{booking.finishTime}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`${statusColor} text-white text-xs font-semibold rounded px-3 py-1 select-none`}>{statusText}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="bg-[#0c3a66] text-white text-[13px] font-semibold rounded px-4 py-1 hover:bg-[#0a2e52] transition-colors duration-200 cursor-pointer">Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          {/* Right side */}
          <aside className="space-y-6">
            {/* Event Baru */}
            <Event />
            {/* Calendar */}
            <Calendar />
          </aside>
        </div>
      )}
    </>
  );
};

export default BookingTable;

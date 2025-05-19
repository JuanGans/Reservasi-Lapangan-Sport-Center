interface Booking {
  id: number;
  court: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
  phone_number: string;
}

interface BookingTableProps {
  bookings: Booking[];
  role: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, role }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg p-4 shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Lapangan</th>
            <th className="py-3 px-6 text-left">Tanggal</th>
            <th className="py-3 px-6 text-left">Waktu</th>
            <th className="py-3 px-6 text-left">Durasi</th>
            <th className="py-3 px-6 text-left">Harga</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">No. Telepon</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="py-2 px-6">{booking.id}</td>
              <td className="py-2 px-6">{booking.court}</td>
              <td className="py-2 px-6">{new Date(booking.date).toLocaleDateString("id-ID")}</td>
              <td className="py-2 px-6">{booking.time}</td>
              <td className="py-2 px-6">{booking.duration} jam</td>
              <td className="py-2 px-6">Rp{booking.price.toLocaleString("id-ID")}</td>
              <td className="py-2 px-6">{booking.status}</td>
              <td className="py-2 px-6">{booking.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;

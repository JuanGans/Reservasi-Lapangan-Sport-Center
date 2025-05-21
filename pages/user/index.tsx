import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatusCard from "../../components/StatusCard";
import BookingTable from "../../components/BookingTable";

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

const AdminPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings/get-all");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Gagal mengambil data bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex">
      {/* SIDEBAR */}
      <Sidebar role={"User"} />

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <Header />

        {/* STATUS CARD ADMIN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatusCard title="Menunggu" count={bookings.filter((b) => b.status === "Pending").length} description="Total yang belum disetujui" icon="far fa-clock" />
          <StatusCard title="Dikonfirmasi" count={bookings.filter((b) => b.status === "Confirmed").length} description="Total barang yang siap diambil" icon="fas fa-check" />
          <StatusCard title="Selesai" count={bookings.filter((b) => b.status === "Done").length} description="Peminjaman yang sudah selesai" icon="fas fa-list-ul" />
          <StatusCard title="Dibatalkan" count={bookings.filter((b) => b.status === "Canceled").length} description="Peminjaman yang dibatalkan" icon="fas fa-lock" />
        </section>

        <BookingTable bookings={bookings} role={"Admin"} />
      </main>
    </div>
  );
};

export default AdminPage;

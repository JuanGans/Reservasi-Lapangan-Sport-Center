import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatusCard from "../../components/StatusCard";
import BookingTable from "../../components/BookingTable";

const AdminPage: React.FC = () => {
  const bookings = [
    { id: "0001", name: "John Doe", orderDate: "Nov, 17 2023", orderTime: "16.45 AM", finishDate: "Nov, 17 2023", finishTime: "16.45 AM", status: "Selesai" },
    { id: "0002", name: "Jane Smith", orderDate: "Nov, 18 2023", orderTime: "16.45 AM", finishDate: "Nov, 18 2023", finishTime: "16.45 AM", status: "Belum Selesai" },
    { id: "0003", name: "Alice Johnson", orderDate: "Nov, 19 2023", orderTime: "16.45 AM", finishDate: "Nov, 19 2023", finishTime: "16.45 AM", status: "Selesai" },
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex">
      {/* SIDEBAR */}
      <Sidebar role={"Admin"} />

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <Header />

        {/* STATUS CARD ADMIN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatusCard title="Menunggu" count={1} description="Total yang belum disetujui" icon="far fa-clock" />
          <StatusCard title="Dikonfirmasi" count={2} description="Total barang yang siap diambil" icon="fas fa-check" />
          <StatusCard title="Selesai" count={3} description="Peminjaman yang sudah selesai" icon="fas fa-list-ul" />
          <StatusCard title="Belum Selesai" count={0} description="Peminjaman yang belum selesai" icon="fas fa-lock" />
        </section>
        <BookingTable bookings={bookings} role={"Admin"} />
      </main>
    </div>
  );
};

export default AdminPage;

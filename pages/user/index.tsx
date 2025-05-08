import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatusCard from "../../components/StatusCard";
import BookingTable from "../../components/BookingTable";

const UserPage: React.FC = () => {
  const bookings = [
    { id: "0001", name: "John Doe", orderDate: "Nov, 17 2023", orderTime: "16.45 AM", finishDate: "Nov, 17 2023", finishTime: "16.45 AM", status: "Selesai" },
    { id: "0002", name: "Jane Smith", orderDate: "Nov, 18 2023", orderTime: "16.45 AM", finishDate: "Nov, 18 2023", finishTime: "16.45 AM", status: "Belum Selesai" },
    { id: "0003", name: "Alice Johnson", orderDate: "Nov, 19 2023", orderTime: "16.45 AM", finishDate: "Nov, 19 2023", finishTime: "16.45 AM", status: "Selesai" },
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex">
      {/* SIDEBAR */}
      <Sidebar role={"User"} />

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <Header />

        {/* STATUS CARD USER */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatusCard title="Total Booking" count={1} description="Total yang telah di booking" icon="far fa-clock" />
          <StatusCard title="Jadwal Mendatang" count={3} description="5 Hari Lagi" icon="fas fa-list-ul" />
          <StatusCard title="Lapangan" count={0} description="Lapangan mendatang" icon="fas fa-lock" />
          <StatusCard title="Poin Reward" count={2} description="Poin Reward" icon="fas fa-check" />
        </section>
        <BookingTable bookings={bookings} role={"User"} />
      </main>
    </div>
  );
};

export default UserPage;

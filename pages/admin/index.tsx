import React, { useEffect, useState } from "react";
import Carousel from "@/components/dashboard/Carousel";
import BookingTable from "@/components/dashboard/BookingTable";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import Toast from "@/components/toast/Toast";

type BookingStatus = "all" | "pending" | "paid" | "canceled" | "completed";

const MemberPage: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus>("all");
  const router = useRouter();

  useEffect(() => {
    const { restricted, repeat } = router.query;
    if (restricted === "1") {
      setToast({ message: "Tidak dapat akses, anda bukan member!", type: "error" });
      router.replace(router.pathname); // Bersihkan query
    } else if (repeat === "1") {
      setToast({ message: "Logout dengan benar!", type: "error" });
      router.replace(router.pathname); // Bersihkan query
    }
  }, [router]);

  // Mengambil data fasilitas
  useEffect(() => {
    async function fetchFacilities() {
      const res = await fetch("/api/facilities/getAllFacilities");
      const data = await res.json();
      setFacilities(data);
    }

    fetchFacilities();
  }, []);

  // Mengambil data booking
  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/bookings/getAllBookings");
      const data = await res.json();
      setBookings(data);
    }

    fetchBookings();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard">
        {/* Carousel Gambar Lapangan */}
        <Carousel facilities={facilities} />

        {/* Filter Status Booking */}
        <div className="mt-6">
          <label className="mr-2 text-blue-900 font-semibold">Filter Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BookingStatus)} className="border border-gray-300 rounded-md p-2 text-gray-500 text-xs cursor-pointer">
            <option value="all">Semua</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="paid">Selesai Membayar</option>
            <option value="canceled">Dibatalkan</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        {/* Tabel Booking */}
        <BookingTable bookings={bookings} filterStatus={filterStatus} />
      </DashboardLayout>
    </>
  );
};

export default MemberPage;

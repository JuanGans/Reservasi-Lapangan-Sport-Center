import React, { useEffect, useState } from "react";
import Carousel from "@/components/dashboard/Carousel";
import ResponsiveBookingView from "@/components/dashboard/ResponsiveBooking";
import DashboardLayout from "@/layout/DashboardLayout";
import { useRouter } from "next/router";
import Toast from "@/components/toast/Toast";
import { Booking } from "@/types/booking";
import { Facility } from "@/types/facility";
import { useUser } from "@/context/userContext";
import { BookingStatus } from "@/types/booking";

const MemberPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookingStatus>("all");
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    const { restricted, repeat, notBooking } = router.query;
    if (restricted === "1") {
      setToast({ message: "Tidak dapat akses, anda bukan admin!", type: "error" });
      router.replace(router.pathname); // Bersihkan query
    } else if (repeat === "1") {
      setToast({ message: "Logout dengan benar!", type: "error" });
      router.replace(router.pathname); // Bersihkan query
    } else if (notBooking === "1") {
      setToast({ message: "Anda melakukan tindakan ilegal!", type: "error" });
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
      try {
        // 1. Ambil data user login dari /api/me
        const userRes = await fetch("/api/auth/me");
        const user = await userRes.json();

        if (!user?.id) throw new Error("User tidak ditemukan");

        // 2. Ambil data booking berdasarkan user.id
        const res = await fetch(`/api/bookings/getAllBookingsById/${user.id}`);
        const data = await res.json();

        setBookings(data);
      } catch (error) {
        setToast({ message: "Gagal mengambil data booking", type: "error" });
      }
    }

    fetchBookings();
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Dashboard Member">
        {/* Carousel Gambar Lapangan */}
        <Carousel facilities={facilities} />

        {/* Filter Status Booking */}
        <div className="mt-6">
          <label className="mr-2 text-blue-900 font-semibold">Filter Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BookingStatus)} className="border border-gray-300 rounded-md p-2 text-gray-500 text-xs cursor-pointer">
            <option value="all">Semua</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="paid">Selesai Membayar</option>
            <option value="confirmed">Booking Sukses</option>
            <option value="canceled">Booking Ditolak</option>
            <option value="expired">Pembayaran Kadaluarsa</option>
            <option value="review">Menunggu Review</option>
            <option value="completed">Selesai</option>
          </select>
        </div>

        {/* Tabel Booking */}
        <ResponsiveBookingView bookings={bookings} filterStatus={filterStatus} setFilterStatus={setFilterStatus} role={user.user?.role ?? "member"} />
      </DashboardLayout>
    </>
  );
};

export default MemberPage;

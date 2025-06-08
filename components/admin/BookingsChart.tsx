import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface Booking {
  booking_date: string;
}

interface Props {
  bookings: Booking[];
}

const BookingChart: React.FC<Props> = ({ bookings }) => {
  const startMonth = new Date("2025-01-01"); // Mulai dari Jan 2025
  const now = new Date();

  // Generate daftar bulan dari Jan 2025 sampai bulan sekarang
  const months: string[] = [];
  const dateCursor = new Date(startMonth);
  while (dateCursor <= now) {
    const label = dateCursor.toLocaleString("default", { month: "short", year: "numeric" }); // Contoh: "Jan 2025"
    months.push(label);
    dateCursor.setMonth(dateCursor.getMonth() + 1);
  }

  // Hitung jumlah booking per bulan
  const monthlyData: Record<string, number> = {};
  bookings.forEach((b) => {
    const date = new Date(b.booking_date);
    const label = date.toLocaleString("default", { month: "short", year: "numeric" });
    monthlyData[label] = (monthlyData[label] || 0) + 1;
  });

  // Buat data final dengan nilai default 0 jika bulan kosong
  const chartData = months.map((month) => ({
    name: month,
    booking: monthlyData[month] || 0,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-5 col-span-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistik Booking per Bulan</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="booking" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingChart;

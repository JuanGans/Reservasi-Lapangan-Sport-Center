import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db"; // pastikan pathnya benar

type Data = {
  message?: string;
  bookingId?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, courtId, bookingDate, bookingStatus = "pending", userName, courtName, durationHours, totalPrice, timeSlots } = req.body;

  if (
    !userId ||
    !courtId ||
    !bookingDate ||
    !userName ||
    !courtName ||
    !durationHours ||
    !totalPrice ||
    !Array.isArray(timeSlots)
  ) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    const db = await connectDB();

    // Insert ke bookings
    const insertBookingQuery = `
      INSERT INTO bookings (userId, facilityId, booking_date, booking_status, nama_user, nama_lapangan, durasi_jam, total_harga)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result]: any = await db.execute(insertBookingQuery, [
      userId,
      courtId,
      bookingDate,
      bookingStatus,
      userName,
      courtName,
      durationHours,
      totalPrice,
    ]);

    const bookingId = result.insertId;

    // Insert ke bookingsessions
    const insertSessionQuery = `
      INSERT INTO bookingsessions (bookingId, start_time, end_time)
      VALUES (?, ?, ?)`;

    for (const startTimeISO of timeSlots) {
      const start = new Date(startTimeISO);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      await db.execute(insertSessionQuery, [bookingId, start, end]);
    }

    return res.status(201).json({ message: "Booking berhasil dibuat", bookingId });
  } catch (error) {
    console.error("Error adding booking:", error);
    return res.status(500).json({ message: "Gagal membuat booking" });
  }
}

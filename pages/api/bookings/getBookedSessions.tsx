import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

type Data = {
  bookedSessions?: { start_time: string; end_time: string }[];
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { courtId, bookingDate } = req.query;

  if (!courtId || !bookingDate) {
    return res.status(400).json({ message: "courtId dan bookingDate harus diberikan" });
  }

  try {
    const db = await connectDB();

    // Query join antara bookings dan bookingsessions, filter by courtId dan bookingDate
    const query = `
      SELECT bs.start_time, bs.end_time
      FROM bookingsessions bs
      JOIN bookings b ON bs.bookingId = b.id
      WHERE b.facilityId = ? AND b.booking_date = ? AND b.booking_status != 'cancelled'
    `;

    const [rows]: any = await db.execute(query, [courtId, bookingDate]);

    // rows berisi array objek { start_time, end_time }
    // ubah ke format string jam untuk frontend (misal "08:00-09:00")
    const bookedSessions = rows.map((session: any) => {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      const pad = (n: number) => n.toString().padStart(2, "0");
      const startStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
      const endStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

      return `${startStr}-${endStr}`;
    });

    return res.status(200).json({ bookedSessions });
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    return res.status(500).json({ message: "Gagal mengambil sesi yang sudah terbooking" });
  }
}

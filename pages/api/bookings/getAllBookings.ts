// pages/api/bookings/getAllBookings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const connection = connectDB();
    const [bookings] = await connection.execute(`
      SELECT 
        b.id AS booking_id,
        b.status,
        b.created_at,
        u.id AS user_id,
        u.name AS user_name,
        f.id AS facility_id,
        f.name AS facility_name,
        s.id AS session_id,
        s.time AS session_time
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN facilities f ON b.facility_id = f.id
      JOIN booking_sessions bs ON bs.booking_id = b.id
      JOIN sessions s ON bs.session_id = s.id
      ORDER BY b.created_at DESC
    `);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

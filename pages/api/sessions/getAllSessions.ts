import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Session extends RowDataPacket {
  id: number;
  booking_id: number;
  facility_id: number;
  start_time: string;
  end_time: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = connectDB();
    const [rows] = await db.execute("SELECT * FROM BookingSessions");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data sessions", error });
  }
}
// This API endpoint retrieves all booking sessions from the BookingSessions table.
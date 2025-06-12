import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Review extends RowDataPacket {
  id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = connectDB();
    const [rows] = await db.execute("SELECT * FROM Reviews");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data review", error });
  }
}
//
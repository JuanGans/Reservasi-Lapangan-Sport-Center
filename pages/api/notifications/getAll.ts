import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Notification extends RowDataPacket {
  id: number;
  user_id: number;
  message: string;
  status: string;
  created_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = connectDB();
    const [rows] = await db.execute("SELECT * FROM Notifications");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data notifikasi", error });
  }
}

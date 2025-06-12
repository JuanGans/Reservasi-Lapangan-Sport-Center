import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const conn = await connectDB();
    const [rows] = await conn.execute("SELECT id, fullname, username, email, no_hp, role FROM Users ORDER BY fullname ASC");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
}

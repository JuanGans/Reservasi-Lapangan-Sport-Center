import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = connectDB();
    const [rows] = await db.query("SELECT NOW() AS `waktu_sekarang`");

    res.status(200).json({
      message: "Berhasil terhubung ke database!",
      waktu_server: rows,
    });
  } catch (error: any) {
    console.error("Koneksi DB gagal:", error);
    res.status(500).json({
      message: "Gagal terhubung ke database.",
      error: error.message,
    });
  }
}

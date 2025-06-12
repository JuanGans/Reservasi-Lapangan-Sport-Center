import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import path from "path";
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID fasilitas tidak ditemukan" });
  }

  try {
    const db = await connectDB();

    // 1. Ambil data fasilitas untuk cek gambar
    const [rows]: any = await db.execute(`SELECT field_image FROM Facilities WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }

    const imagePath = rows[0].field_image;

    // 2. Hapus file gambar dari /public/assets/field
    if (imagePath) {
      const absolutePath = path.join(process.cwd(), "public/assets/field", imagePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    // 3. Hapus data dari database
    const [result]: any = await db.execute(`DELETE FROM Facilities WHERE id = ?`, [id]);

    return res.status(200).json({ message: "Fasilitas berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus fasilitas:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat menghapus fasilitas" });
  }
}

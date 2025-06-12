import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "User ID dan password baru wajib diisi" });
  }

  try {
    const connection = connectDB();

    // Optional: cek apakah user ada
    const [users] = await connection.execute("SELECT id FROM Users WHERE id = ?", [userId]);
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.execute("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    return res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Gagal update password:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}

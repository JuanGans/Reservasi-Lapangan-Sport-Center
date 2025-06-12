import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { identifier } = req.body; // bisa email atau no_hp

  if (!identifier) {
    return res.status(400).json({ message: "Email atau nomor HP wajib diisi" });
  }

  try {
    const connection = connectDB();

    const [rows] = await connection.execute("SELECT id FROM Users WHERE email = ? OR no_hp = ?", [identifier, identifier]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Email atau nomor HP tidak ditemukan" });
    }

    const user = rows[0] as { id: number };

    // Di sini kamu bisa kirim email/OTP jika ingin (LEK MAU RIBET)

    // Kirim userId (atau token) ke frontend untuk redirect
    return res.status(200).json({
      message: "Pengguna ditemukan, mengarahkan ke halaman reset password",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

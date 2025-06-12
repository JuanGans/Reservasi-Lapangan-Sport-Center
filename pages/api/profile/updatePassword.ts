import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect ke database (misal pakai mysql2)
    const connection = connectDB();

    // Ambil token dari cookie
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Tidak ada token" });

    // Verifikasi token dan ambil userId
    const decoded: any = getUserFromToken(token);
    const userId = decoded.id;
    if (!userId) return res.status(401).json({ message: "Token tidak valid" });

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter" });
    }

    // Query user password dari DB
    const [rows]: any = await connection.execute("SELECT password FROM Users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Password lama salah" });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await connection.execute("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    return res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
}

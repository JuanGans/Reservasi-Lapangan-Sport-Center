import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fullname, username, email, role, password, no_hp } = req.body;

    // Validasi input
    if (!fullname?.trim() || !username?.trim() || !email?.trim() || !password?.trim() || !no_hp?.trim()) {
      return res.status(400).json({ message: "Semua field wajib diisi lengkap." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }

    if (username.length < 3 || /\s/.test(username)) {
      return res.status(400).json({ message: "Username minimal 3 karakter dan tidak boleh mengandung spasi." });
    }

    const db = connectDB();

    // Cek email/username ganda
    const [usernameCheck] = await db.execute(`SELECT id FROM users WHERE username = ?`, [username]);
    if ((usernameCheck as any[]).length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan." });
    }

    const [emailCheck] = await db.execute(`SELECT id FROM users WHERE email = ?`, [email]);
    if ((emailCheck as any[]).length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (fullname, username, email, role, password, no_hp, user_img)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullname, username, email, role || "member", hashedPassword, no_hp, "default-user.jpg"]
    );

    const insertedId = (result as any).insertId;

    return res.status(201).json({
      id: insertedId,
      fullname,
      username,
      email,
      role,
      no_hp,
      user_img: "default-user.jpg",
    });
  } catch (error: any) {
    console.error("Add user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat menambah user." });
  }
}

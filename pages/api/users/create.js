import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { name, email, phone, password } = req.body;

  // Cek apakah data sudah lengkap
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query untuk insert data user baru
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    // Mengembalikan response setelah berhasil
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone
    });
  } catch (error) {
    res.status(500).json({ error: "User creation failed", detail: error.message });
  }
}

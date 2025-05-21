import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

// LOGIN HANDLER FUNCTION
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // MENGECEK METHOD POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // MENGAMBIL EMAIL, PASSWORD, DAN ROLE
  const { email, password, role } = req.body;

  // MEWAJIBKAN ISI EMAIL, PASSWORD, DAN ROLE
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  try {
    // CONNECT DATABASE
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "futsal_management",
    });

    // CARI USER BERDASARKAN EMAIL
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    // KONEKSI BERAKHIR
    await connection.end();

    // JIKA USER TIDAK TERDAFTAR, TIDAK DIIZINKAN MASUK
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // DATA USER
    const user = rows[0] as {
      id: number;
      email: string;
      password: string;
      role: string;
    };

    // CEK PASSWORD
    const passwordMatch = await bcrypt.compare(password, user.password);

    // JIKA PASSWORD SALAH, TIDAK DIIZINKAN MASUK
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // VALIDASI ROLE DENGAN USER YANG TERDAFTAR
    if (user.role !== role) {
      return res.status(403).json({ message: "Role tidak sesuai dengan akun" });
    }

    // GENERATE TOKEN SESSION
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "secret-key", { expiresIn: "1h" });

    // STATUS LOGIN BERHASIL
    res.status(200).json({ message: "Login successful", token, role: user.role });

    // MENANGKAP ERROR
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

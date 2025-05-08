import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "sport_center",
    });

    // Cari user berdasarkan email
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    await connection.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0] as {
      id: number;
      email: string;
      password: string;
      role: string;
    };

    // Cek password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validasi role yang dipilih saat login
    if (user.role !== role) {
      return res.status(403).json({ message: "Role tidak sesuai dengan akun" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

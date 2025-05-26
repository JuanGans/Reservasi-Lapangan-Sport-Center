import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { connectDB } from "@/lib/db";

// LOGIN HANDLER FUNCTION
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // MENGECEK METHOD POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // MENGAMBIL USERNAME, PASSWORD, DAN ROLE
  const { username, password, role } = req.body;

  // MEWAJIBKAN ISI USERNAME, PASSWORD, DAN ROLE
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  try {
    // CONNECT DATABASE
    const connection = connectDB();

    // CARI USER BERDASARKAN USERNAME
    const [rows] = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);

    // JIKA USER TIDAK TERDAFTAR, TIDAK DIIZINKAN MASUK
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // DATA USER
    const user = rows[0] as {
      id: number;
      fullname: string;
      email: string;
      username: string;
      password: string;
      no_hp: string;
      user_img: string;
      role: string;
    };

    // CEK PASSWORD
    const passwordMatch = await bcrypt.compare(password, user.password);

    // JIKA PASSWORD SALAH, TIDAK DIIZINKAN MASUK
    if (!passwordMatch) {
      return res.status(401).json({ message: "Kredensial salah!" });
    }

    // VALIDASI ROLE DENGAN USER YANG TERDAFTAR
    if (user.role !== role) {
      return res.status(403).json({ message: "Role tidak sesuai dengan akun" });
    }

    // GENERATE TOKEN SESSION
    const token = jwt.sign({ id: user.id, fullname: user.fullname, email: user.email, username: user.username, no_hp: user.no_hp, user_img: user.user_img, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    // SET COOKIE
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 jam
        // secure: false,
        secure: process.env.NODE_ENV === "production",
      })
    );

    // STATUS LOGIN BERHASIL
    res.status(200).json({ message: "Login successful" });

    // MENANGKAP ERROR
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

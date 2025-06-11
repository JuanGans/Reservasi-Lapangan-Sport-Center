import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  try {
    const connection = connectDB();

    // Cari user berdasarkan username
    const [rows] = await connection.execute("SELECT * FROM `Users` WHERE username = ?", [username]);


    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan!" });
    }

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

    // Cek password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Kredensial salah!" });
    }

    // Cek role
    if (user.role !== role) {
      return res.status(403).json({ message: "Role tidak sesuai dengan akun" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        no_hp: user.no_hp,
        user_img: user.user_img,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 jam
        secure: process.env.NODE_ENV === "production",
      })
    );

    res.status(200).json({ message: "Login sukses!" });
  } catch (error: any) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

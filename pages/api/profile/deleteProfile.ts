import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import fs from "fs";
import path from "path";
import { serialize } from "cookie";

interface UserRow extends RowDataPacket {
  user_img: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.id;

  try {
    const db = connectDB();

    // Ambil user_img lama
    const [rows] = (await db.execute("SELECT user_img FROM Users WHERE id = ?", [userId])) as [UserRow[], any];
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userImage = user.user_img;
    const imagePath = path.join(process.cwd(), "public/assets/user", userImage);

    // Hapus file gambar kecuali default
    if (userImage && userImage !== "default-user.jpg" && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Hapus user dari database
    await db.execute("DELETE FROM Users WHERE id = ?", [userId]);

    // Hapus cookie token
    res.setHeader(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        expires: new Date(0),
      })
    );

    return res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

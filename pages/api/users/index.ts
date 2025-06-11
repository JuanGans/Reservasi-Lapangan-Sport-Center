import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectDB();

  if (req.method === "GET") {
    try {
      const [users] = await db.query("SELECT id, fullname, username, email, role, no_hp, user_img FROM `Users`");
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: "Gagal mengambil data user", error: error.message });
    }
  }

  if (req.method === "POST") {
    return res.status(405).json({ message: "Gunakan endpoint /api/addUser.ts untuk tambah user" });
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}

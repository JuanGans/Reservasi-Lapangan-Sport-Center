import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed" });

  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "Id user wajib disertakan" });

  try {
    const conn = connectDB();
    const [result] = await conn.execute("DELETE FROM Users WHERE id = ?", [id]);

    // Optional: Check affectedRows if you want to confirm deletion
    return res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Gagal menghapus user" });
  }
}

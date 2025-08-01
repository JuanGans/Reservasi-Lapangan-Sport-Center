import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, fullname, username, email, role, no_hp } = req.body;

  if (!id || !fullname || !username || !email || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi (kecuali no_hp opsional)" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }

  if (username.length < 3 || /\s/.test(username)) {
    return res.status(400).json({ message: "Username minimal 3 karakter dan tidak boleh ada spasi" });
  }

  try {
    const conn = connectDB();

    const [existingUsername] = await conn.execute("SELECT id FROM Users WHERE username = ? AND id != ?", [username, id]);

    if ((existingUsername as any[]).length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan oleh pengguna lain" });
    }

    const [existingEmail] = await conn.execute("SELECT id FROM Users WHERE email = ? AND id != ?", [email, id]);

    if ((existingEmail as any[]).length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan oleh pengguna lain" });
    }

    await conn.execute(`UPDATE Users SET fullname = ?, username = ?, email = ?, role = ?, no_hp = ? WHERE id = ?`, [fullname, username, email, role, no_hp || null, id]);

    const [updatedUsers] = await conn.execute("SELECT id, fullname, username, email, role, no_hp FROM Users WHERE id = ?", [id]);

    const updatedUser = (updatedUsers as any[])[0];

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Edit user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui user" });
  }
}

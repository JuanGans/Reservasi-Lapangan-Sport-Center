import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, fullname, username, email, role, no_hp, password } = req.body;

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
    const conn = await connectDB();

    const [existingUsername] = await conn.execute(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, id]
    );

    if ((existingUsername as any[]).length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan oleh pengguna lain" });
    }

    const [existingEmail] = await conn.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if ((existingEmail as any[]).length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan oleh pengguna lain" });
    }

    let query = "";
    let params: any[] = [];

    if (password && password.trim() !== "") {
      // Hash password baru
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE users SET fullname = ?, username = ?, email = ?, role = ?, no_hp = ?, password = ? WHERE id = ?`;
      params = [fullname, username, email, role, no_hp || null, hashedPassword, id];
    } else {
      query = `UPDATE users SET fullname = ?, username = ?, email = ?, role = ?, no_hp = ? WHERE id = ?`;
      params = [fullname, username, email, role, no_hp || null, id];
    }

    await conn.execute(query, params);

    // Ambil user yang sudah diupdate untuk dikembalikan
    const [updatedUsers] = await conn.execute(
      "SELECT id, fullname, username, email, role, no_hp FROM users WHERE id = ?",
      [id]
    );
    const updatedUser = (updatedUsers as any[])[0];

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Edit user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui user" });
  }
}

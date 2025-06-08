import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notifId = parseInt(req.query.id as string);

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil user dari token
    const user = getUserFromToken(token);
    if (!user) return res.status(401).json({ message: "Token tidak valid" });

    // Pastikan notifikasi milik user ini
    const notif = await prisma.notifications.findUnique({
      where: { id: notifId },
    });

    if (!notif) return res.status(404).json({ error: "Notifikasi tidak ditemukan" });

    // UPDATE NOTIFIKASI
    await prisma.notifications.delete({
      where: { id: notifId },
    });

    res.status(200).json({ message: "Notifikasi berhasil dihapus" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

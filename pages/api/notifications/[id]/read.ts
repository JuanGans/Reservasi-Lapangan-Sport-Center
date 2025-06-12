import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notifId = parseInt(req.query.id as string);

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil user dari token
    const user = getUserFromToken(token);
    if (!user) return res.status(401).json({ message: "Token tidak valid" });

    // Pastikan notifikasi milik user ini
    const notif = await prisma.notifications.findFirst({
      where: {
        id: notifId,
        userId: user.id,
      },
    });

    if (!notif) return res.status(404).json({ error: "Notifikasi tidak ditemukan" });

    // UPDATE NOTIFIKASI
    await prisma.notifications.update({
      where: { id: notifId },
      data: { is_read: true },
    });

    res.status(200).json({ message: "Notifikasi ditandai sebagai dibaca" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

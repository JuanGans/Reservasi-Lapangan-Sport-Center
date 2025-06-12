// /pages/api/notifications/me.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil user dari token
    const user = getUserFromToken(token);
    if (!user) return res.status(401).json({ message: "Token tidak valid" });

    const notifications = await prisma.notifications.findMany({
      where: { userId: user.id },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("[ERROR] Get Notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

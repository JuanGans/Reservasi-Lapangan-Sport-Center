import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const bookingId = typeof req.query.id === "string" ? parseInt(req.query.id) : null;
  if (!bookingId) return res.status(400).json({ error: "ID tidak valid" });

  try {
    // UPDATE STATUS JADI EXPIRED
    await prisma.bookings.update({
      where: { id: bookingId },
      data: { booking_status: "expired" },
    });

    // UPDATE NOTIFICATION
    await prisma.notifications.update({
      where: { bookingId: bookingId },
      data: {
        message: `Waktu habis! Booking anda dibatalkan otomatis!`,
        type: "expired",
        is_read: false,
      },
    });

    res.json({ message: "Booking dibatalkan" });
  } catch (err) {
    res.status(500).json({ error: "Gagal membatalkan booking" });
  }
}

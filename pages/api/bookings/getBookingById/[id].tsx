// pages/api/bookings/getBookingById/[id].ts

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const prisma = new PrismaClient();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const booking = await prisma.bookings.findUnique({
      where: { id: Number(id) },
      include: {
        facility: true,
        sessions: true,
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            no_hp: true,
            user_img: true,
            role: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.error("Gagal mengambil booking:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data booking" });
  }
}

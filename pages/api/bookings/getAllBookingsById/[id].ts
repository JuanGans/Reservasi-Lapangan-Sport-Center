import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = parseInt(req.query.id as string);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "User ID tidak valid" });
  }

  try {
    const bookings = await prisma.bookings.findMany({
      where: { userId },
      include: {
        facility: true,
        sessions: true,
        transaction: true,
        review: true,
      },
      orderBy: { created_at: "desc" },
    });

    return res.json(bookings);
  } catch (error) {
    console.error("Gagal ambil data booking:", error);
    return res.status(500).json({ error: "Gagal mengambil data" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    const transaction = await prisma.transactions.findUnique({
      where: { id: parseInt(id) },
      include: {
        booking: {
          include: {
            sessions: true,
            facility: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    return res.status(200).json({ transaction });
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

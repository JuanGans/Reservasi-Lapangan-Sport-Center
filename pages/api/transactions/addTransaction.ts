// /pages/api/transactions/addTransaction.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getUserFromToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Ambil token dari cookie
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil user dari token
    const user = getUserFromToken(token);
    if (!user) return res.status(401).json({ message: "Token tidak valid" });

    const { bookingId, amount, payment_method } = req.body;

    const transaction = await prisma.transactions.create({
      data: {
        bookingId,
        amount, // atau ambil dari booking
        payment_method,
        status: "pending",
      },
    });

    await prisma.notifications.update({
      where: { bookingId: bookingId },
      data: {
        message: `Segera lakukan pembayaran booking sebelum waktu habis.`,
        type: "payment",
        is_read: false,
        transactionId: transaction.id,
      },
    });

    return res.status(200).json({ message: "Transaksi berhasil dibuat", transaction });
  } catch (error) {
    console.error("Error membuat transaksi:", error);
    return res.status(500).json({ error: "Gagal membuat transaksi" });
  }
}

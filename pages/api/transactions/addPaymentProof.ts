// /pages/api/transactions/addPaymentProof.ts

import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/getUserFromToken";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const uploadDir = path.join(process.cwd(), "/public/assets/proof");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    keepExtensions: true,
    uploadDir,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ message: "Gagal memproses form" });
      }

      // Ambil token dari cookie
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // Ambil user dari token
      const user = getUserFromToken(token);
      if (!user) return res.status(401).json({ message: "Token tidak valid" });

      const transactionId = parseInt(Array.isArray(fields.transactionId) ? fields.transactionId[0] : fields.transactionId || "");
      // const amount = parseInt(Array.isArray(fields.amount) ? fields.amount[0] : fields.amount || "");
      const file = Array.isArray(files.paymentProof) ? files.paymentProof[0] : files.paymentProof;

      if (!transactionId || !file) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      const filename = `proof-${transactionId}-${Date.now()}${path.extname(file.originalFilename || "")}`;
      const newPath = path.join(uploadDir, filename);

      fs.renameSync(file.filepath, newPath);

      const updatedTransaction = await prisma.transactions.update({
        where: { id: transactionId },
        data: {
          // amount,
          payment_proof: filename,
          payment_time: new Date(),
          status: "paid",
        },
        include: {
          booking: true, // supaya bisa ambil id booking
        },
      });

      // Update Status Dari Booking
      if (updatedTransaction.booking) {
        await prisma.bookings.update({
          where: { id: updatedTransaction.booking.id },
          data: { booking_status: "paid" },
        });
      }

      // ✅ Update specific notification by ID
      await prisma.notifications.update({
        where: { transactionId: transactionId },
        data: {
          message: "Pembayaran berhasil. Booking Anda sedang diverifikasi oleh Admin. Mohon ditunggu!",
          type: "paid",
          is_read: false,
        },
      });

      return res.status(200).json({
        message: "Bukti telah diupload, transaksi anda sedang diproses. Silahkan tunggu konfirmasi dari Admin!",
        transaction: updatedTransaction,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Server error saat upload bukti" });
    }
  });
}

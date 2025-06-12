// pages/api/bookings/verifyBooking.ts

import { NextApiRequest, NextApiResponse } from "next";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ message: "bookingId wajib dikirim di body" });
  }

  try {
    const booking = await prisma.bookings.update({
      where: { id: bookingId },
      data: { booking_status: "confirmed" },
      include: { user: true, transaction: true, facility: true },
    });

    const bookingDateStr = new Date(booking.booking_date).toLocaleDateString("id-ID");
    const facilityName = booking.facility?.field_name ?? "lapangan";

    // Hapus notifikasi lama jika ada
    await prisma.notifications.deleteMany({
      where: {
        bookingId: booking.id,
        transactionId: booking.transaction?.id || null,
      },
    });

    await prisma.notifications.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        transactionId: booking.transaction?.id || null, // gunakan 0 kalau null
        message: `✅ Booking Anda untuk ${booking.facility?.field_name ?? "lapangan"} pada ${new Date(booking.booking_date).toLocaleDateString("id-ID")} telah diverifikasi.`,
        type: "confirmed",
        is_read: false,
      },
    });

    // Cari semua admin
    const admins = await prisma.users.findMany({
      where: { role: Role.admin }, // atau pakai UserRole.ADMIN jika enum
    });

    // Notifikasi untuk semua admin
    if (admins.length > 0) {
      await prisma.notifications.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          message: `⚠️ Booking oleh ${booking.user.username} untuk ${facilityName} pada ${bookingDateStr} telah DITERIMA.`,
          type: "info",
          is_read: false,
        })),
        skipDuplicates: true,
      });
    }

    return res.status(200).json({ message: "Booking berhasil diverifikasi" });
  } catch (error) {
    console.error("Verify Booking Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat verifikasi booking" });
  }
}

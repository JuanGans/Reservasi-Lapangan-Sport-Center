import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "@/lib/getUserFromToken"; // path disesuaikan
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Ambil token dari cookie
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Ambil user dari token
    const user = getUserFromToken(token);
    if (!user) return res.status(401).json({ message: "Token tidak valid" });

    const userId = user.id;

    const { facilityId, booking_date, total_price, sessions } = req.body;

    if (!facilityId || !booking_date || !total_price || !Array.isArray(sessions)) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Simpan booking
    const booking = await prisma.bookings.create({
      data: {
        userId,
        facilityId,
        booking_date: new Date(booking_date),
        total_price,
        expired_at: new Date(new Date().getTime() + (7 * 60 + 30) * 60 * 1000),
        sessions: {
          create: sessions.map((s: { start_time: string; end_time: string; session_label: string }) => ({
            start_time: new Date(s.start_time),
            end_time: new Date(s.end_time),
            session_label: s.session_label,
          })),
        },
      },
      include: {
        facility: true,
      },
    });

    // Simpan notifikasi
    await prisma.notifications.create({
      data: {
        userId,
        message: `Booking lapangan ${booking.facility.field_name} berhasil dibuat, silahkan lanjutkan ke pembayaran.`,
        type: "booking",
        bookingId: booking.id,
        transactionId: null,
      },
    });

    return res.status(200).json({ message: "Booking berhasil dibuat", booking });
  } catch (error) {
    console.error("Gagal membuat booking:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat membuat booking" });
  }
}

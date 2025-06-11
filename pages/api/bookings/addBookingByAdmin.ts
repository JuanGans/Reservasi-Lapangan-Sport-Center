import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/getUserFromToken"; // Pastikan path sesuai proyekmu

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Ambil token dari cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token tidak tersedia" });
    }

    // Verifikasi token dan ambil user
    const user = getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Token tidak valid" });
    }

    // Ambil data dari body
    const { userId, facilityId, booking_date, total_price, sessions } = req.body;

    // Validasi data
    if (!facilityId || !booking_date || !total_price || !Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({ message: "Data tidak lengkap atau tidak valid" });
    }

    // Validasi setiap sesi
    const parsedSessions = sessions.map((s: any, idx: number) => {
      if (typeof s.start_time !== "string" || typeof s.end_time !== "string" || typeof s.session_label !== "string") {
        throw new Error(`Format sesi tidak valid pada index ${idx}`);
      }

      return {
        start_time: new Date(s.start_time),
        end_time: new Date(s.end_time),
        session_label: s.session_label,
      };
    });

    // Buat data booking
    const booking = await prisma.bookings.create({
      data: {
        userId,
        facilityId,
        booking_date: new Date(booking_date),
        booking_status: "confirmed",
        total_price: Number(total_price),
        sessions: {
          create: parsedSessions,
        },
      },
      include: {
        facility: true,
      },
    });

    // Tambahkan notifikasi booking
    await prisma.notifications.create({
      data: {
        userId,
        message: `Booking lapangan ${booking.facility.field_name} berhasil dibuat oleh Admin.`,
        type: "confirmed",
        bookingId: null,
        transactionId: null,
      },
    });

    return res.status(200).json({ message: "Booking berhasil dibuat", booking });
  } catch (error: any) {
    console.error("Gagal membuat booking:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat membuat booking" });
  }
}

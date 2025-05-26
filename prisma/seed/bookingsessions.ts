import { PrismaClient } from "@prisma/client";

export default async function seedBookingSessions(prisma: PrismaClient) {
  // Ambil semua bookings untuk dibuatkan sesi (opsional: bisa juga hanya sebagian)
  const bookings = await prisma.bookings.findMany();

  const sessionData = bookings.flatMap((booking, index) => {
    const startTime = new Date(booking.booking_date);
    startTime.setHours(8 + index); // variasi waktu mulai
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // durasi 1 jam

    return {
      bookingId: booking.id,
      start_time: startTime,
      end_time: endTime,
    };
  });

  for (const session of sessionData) {
    await prisma.bookingSessions.create({
      data: session,
    });
  }

  console.log("✅ Seed booking sessions selesai");
}

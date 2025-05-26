import { PrismaClient, BookingStatus } from "@prisma/client";

export default async function seedBookings(prisma: PrismaClient) {
  // Contoh data, sesuaikan userId dan facilityId dengan data yang valid di database kamu
  const bookingsData = [
    {
      userId: 1,
      facilityId: 1,
      booking_date: new Date("2025-06-01"),
      booking_status: BookingStatus.pending,
    },
    {
      userId: 1,
      facilityId: 2,
      booking_date: new Date("2025-06-05"),
      booking_status: BookingStatus.paid,
    },
    {
      userId: 1,
      facilityId: 3,
      booking_date: new Date("2025-06-10"),
      booking_status: BookingStatus.completed,
    },
  ];

  for (const booking of bookingsData) {
    await prisma.bookings.create({
      data: booking,
    });
  }
  console.log("✅ Seed bookings selesai");
}

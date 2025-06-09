import { PrismaClient, BookingStatus } from "@prisma/client";

export default async function seedBookings(prisma: PrismaClient) {
  const today = new Date();

  const bookingData = [
    // Booking yang selesai (untuk review)
    {
      userId: 1,
      facilityId: 1,
      booking_date: new Date("2025-01-05"),
      booking_status: BookingStatus.completed,
      total_price: 300000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 1,
      facilityId: 2,
      booking_date: new Date("2025-02-05"),
      booking_status: BookingStatus.completed,
      total_price: 140000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 1,
      facilityId: 3,
      booking_date: new Date("2025-03-05"),
      booking_status: BookingStatus.completed,
      total_price: 260000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 1,
      facilityId: 4,
      booking_date: new Date("2025-04-05"),
      booking_status: BookingStatus.completed,
      total_price: 480000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 1,
      facilityId: 5,
      booking_date: new Date("2025-05-05"),
      booking_status: BookingStatus.completed,
      total_price: 400000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 1,
      facilityId: 6,
      booking_date: new Date("2025-06-05"),
      booking_status: BookingStatus.completed,
      total_price: 170000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 2,
      facilityId: 1,
      booking_date: new Date("2025-06-07"),
      booking_status: BookingStatus.review,
      total_price: 300000,
      created_at: today,
      updated_at: today,
    },
    // Booking yang sudah dibayar (belum selesai pakai)
    {
      userId: 2,
      facilityId: 2,
      booking_date: new Date("2025-07-25"),
      booking_status: BookingStatus.paid,
      total_price: 140000,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 3,
      facilityId: 3,
      booking_date: new Date("2025-07-26"),
      booking_status: BookingStatus.paid,
      total_price: 260000,
      created_at: today,
      updated_at: today,
    },
  ];

  for (const booking of bookingData) {
    await prisma.bookings.create({ data: booking });
  }

  console.log("✅ Seed bookings selesai");
}

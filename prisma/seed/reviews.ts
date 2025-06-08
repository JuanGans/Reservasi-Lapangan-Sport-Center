import { subDays, subHours } from "date-fns";
import { PrismaClient } from "@prisma/client";

export default async function seedReviews(prisma: PrismaClient) {
  const now = new Date();

  const reviewData = [
    {
      bookingId: 1,
      rating: 5,
      comment: "Lapangan bersih dan nyaman.",
      created_at: subDays(now, 1),
      updated_at: subDays(now, 1),
    },
    {
      bookingId: 2,
      rating: 4,
      comment: "Cukup bagus, tapi kamar mandi perlu perbaikan.",
      created_at: subDays(now, 2),
      updated_at: subDays(now, 2),
    },
    {
      bookingId: 3,
      rating: 4,
      comment: "Banyak genangan air saat hujan.",
      created_at: subDays(now, 3),
      updated_at: subDays(now, 3),
    },
    {
      bookingId: 4,
      rating: 5,
      comment: "Mantap! Bakal booking lagi minggu depan.",
      created_at: subDays(now, 4),
      updated_at: subDays(now, 4),
    },
    {
      bookingId: 5,
      rating: 5,
      comment: "Fasilitas lengkap dan staff ramah.",
      created_at: subDays(now, 5),
      updated_at: subDays(now, 5),
    },
    {
      bookingId: 6,
      rating: 5,
      comment: "Booking mudah dan cepat.",
      created_at: subDays(now, 2),
      updated_at: subDays(now, 2),
    },
    // {
    //   bookingId: 7,
    //   rating: 5,
    //   comment: "Mantap! Bakal booking lagi minggu depan.",
    //   created_at: subHours(subDays(now, 1), 5),
    //   updated_at: subHours(subDays(now, 1), 5),
    // },
  ];

  for (const review of reviewData) {
    await prisma.reviews.create({ data: review });
  }

  console.log("✅ Seed reviews selesai");
}

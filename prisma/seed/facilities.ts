import { PrismaClient } from "@prisma/client";

export default async function seedFacilities(prisma: PrismaClient) {
  const facilities = [
    {
      field_name: "Lapangan Futsal A",
      field_image: "futsal_1.jpg",
      field_desc: "Lapangan indoor berstandar nasional dengan lantai vinyl dan pencahayaan LED.",
      price_per_session: 150000.0,
      avg_rating: 5,
      total_review: 1,
    },
    {
      field_name: "Lapangan Futsal B",
      field_image: "futsal_2.jpg",
      field_desc: "Cocok untuk latihan tim, tersedia ruang ganti dan tribun penonton.",
      price_per_session: 140000.0,
      avg_rating: 4,
      total_review: 1,
    },
    {
      field_name: "Lapangan Basket C",
      field_image: "basket_1.jpg",
      field_desc: "Lapangan outdoor dan pencahayaan malam hari.",
      price_per_session: 130000.0,
      avg_rating: 4,
      total_review: 1,
    },
    {
      field_name: "Lapangan Basket D",
      field_image: "basket_2.jpg",
      field_desc: "Tersedia 3 lapangan indoor ber-AC dengan lantai kayu.",
      price_per_session: 160000.0,
      avg_rating: 5,
      total_review: 1,
    },
    {
      field_name: "Kolam Renang E",
      field_image: "renang_1.jpg",
      field_desc: "Lapangan dengan permukaan sintetis dan tersedia pelatih profesional.",
      price_per_session: 200000.0,
      avg_rating: 5,
      total_review: 1,
    },
    {
      field_name: "Kolam Renang F",
      field_image: "renang_2.jpg",
      field_desc: "Tersedia untuk turnamen sekolah atau komunitas dengan fasilitas lengkap.",
      price_per_session: 170000.0,
      avg_rating: 5,
      total_review: 1,
    },
  ];

  for (const facility of facilities) {
    await prisma.facilities.create({
      data: facility,
    });
  }

  console.log("✅ Seed facilities berhasil");
}

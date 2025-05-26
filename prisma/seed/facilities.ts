import { PrismaClient } from "@prisma/client";

export default async function seedFacilities(prisma: PrismaClient) {
  const facilities = [
    {
      field_name: "Lapangan Futsal A",
      field_image: "https://jasakontraktorlapangan.id/wp-content/uploads/2023/06/Jasa-Pembuatan-Lapangan-Futsal-Kendari.jpg",
      field_desc: "Lapangan indoor berstandar nasional dengan lantai vinyl dan pencahayaan LED.",
      price_per_session: 150000.0,
    },
    {
      field_name: "Lapangan Futsal B",
      field_image: "https://storage.googleapis.com/data.ayo.co.id/photos/77445/SEO%20HDI%204/80.%20Cara%20Cepat%20dan%20Mudah%20Menyewa%20Lapangan%20Futsal%20untuk%20Tim%20Anda.jpg",
      field_desc: "Cocok untuk latihan tim, tersedia ruang ganti dan tribun penonton.",
      price_per_session: 140000.0,
    },
    {
      field_name: "Lapangan Futsal C",
      field_image: "https://i0.wp.com/ritaelfianis.id/wp-content/uploads/2023/08/10-Cara-Mengelola-Bisnis-Lapangan-Futsal-Untuk-Pemula.jpeg",
      field_desc: "Lapangan outdoor dan pencahayaan malam hari.",
      price_per_session: 130000.0,
    },
    {
      field_name: "Lapangan Futsal D",
      field_image: "https://paradeapparel.id/wp-content/uploads/2021/01/Vinyl-compressed-1024x681.jpg",
      field_desc: "Tersedia 3 lapangan indoor ber-AC dengan lantai kayu.",
      price_per_session: 160000.0,
    },
    {
      field_name: "Lapangan Futsal E",
      field_image: "https://jersey-printing.com/images/upload/21.%20Lapangan%20Futsal%20Sintetis,%20Enak%20untuk%20Main%20Futsal%20atau%20Tidak.jpg",
      field_desc: "Lapangan dengan permukaan sintetis dan tersedia pelatih profesional.",
      price_per_session: 155000.0,
    },
    {
      field_name: "Lapangan Futsal F",
      field_image: "https://vendors.id/wp-content/uploads/2024/03/ezgif-3-639eb0bef5.webp",
      field_desc: "Tersedia untuk turnamen sekolah atau komunitas dengan fasilitas lengkap.",
      price_per_session: 170000.0,
    },
  ];

  for (const facility of facilities) {
    await prisma.facilities.create({
      data: facility,
    });
  }

  console.log("✅ Seed facilities berhasil");
}

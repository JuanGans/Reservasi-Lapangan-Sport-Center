import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: "Budi",
      email: "budi@example.com",
      bookings: {
        create: {
          court: "Lapangan A",
          date: new Date("2025-06-01T10:00:00"),
        },
      },
    },
  });

  console.log("Seed berhasil:", user1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

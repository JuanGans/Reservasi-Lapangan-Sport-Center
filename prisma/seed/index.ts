import { PrismaClient } from "@prisma/client";
import seedUsers from "./users";
import seedFacilities from "./facilities";
import seedBookings from "./bookings";
import seedBookingSessions from "./bookingsessions";

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedFacilities(prisma);
  await seedBookings(prisma);
  await seedBookingSessions(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

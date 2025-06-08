import { PrismaClient } from "@prisma/client";
import seedUsers from "./users";
import seedFacilities from "./facilities";
import seedBookings from "./bookings";
import seedBookingSessions from "./bookingsessions";
import seedTransactions from "./transactions";
import seedNotifications from "./notifications";
import seedReviews from "./reviews";

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedFacilities(prisma);
  await seedBookings(prisma);
  await seedBookingSessions(prisma);
  await seedTransactions(prisma);
  await seedNotifications(prisma);
  await seedReviews(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import { addDays, addHours, setHours, setMinutes } from "date-fns";

export default async function seedBookingSessions(prisma: PrismaClient) {
  const toWIB = (date: Date) => addHours(date, 7); // konversi UTC ke WIB

  const sessionData = [
    // Untuk (booking yang sudah selesai)
    // BOOKING ID 1: 2X LAPANGAN 1
    {
      bookingId: 1,
      start_time: toWIB(setHours(setMinutes(new Date("2025-01-05"), 0), 8)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-01-05"), 0), 9)),
      session_label: "08:00 - 09:00",
    },
    {
      bookingId: 1,
      start_time: toWIB(setHours(setMinutes(new Date("2025-01-05"), 0), 9)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-01-05"), 0), 10)),
      session_label: "09:00 - 10:00",
    },
    // BOOKING ID 2: 1X LAPANGAN 2
    {
      bookingId: 2,
      start_time: toWIB(setHours(setMinutes(new Date("2025-02-05"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-02-05"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    // BOOKING ID 3: 2X LAPANGAN 3
    {
      bookingId: 3,
      start_time: toWIB(setHours(setMinutes(new Date("2025-03-05"), 0), 11)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-03-05"), 0), 12)),
      session_label: "11:00 - 12:00",
    },
    {
      bookingId: 3,
      start_time: toWIB(setHours(setMinutes(new Date("2025-03-05"), 0), 12)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-03-05"), 0), 13)),
      session_label: "12:00 - 13:00",
    },
    // BOOKING ID 4: 3X LAPANGAN 4
    {
      bookingId: 4,
      start_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 19), 0)),
      end_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 20), 0)),
      session_label: "19:00 - 20:00",
    },
    {
      bookingId: 4,
      start_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 20), 0)),
      end_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 21), 0)),
      session_label: "20:00 - 21:00",
    },
    {
      bookingId: 4,
      start_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 21), 0)),
      end_time: toWIB(setMinutes(setHours(new Date("2025-04-05"), 22), 0)),
      session_label: "21:00 - 22:00",
    },
    // BOOKING ID 5: 2X LAPANGAN 5
    {
      bookingId: 5,
      start_time: toWIB(setHours(setMinutes(new Date("2025-05-05"), 0), 9)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-05-05"), 0), 10)),
      session_label: "09:00 - 10:00",
    },
    {
      bookingId: 5,
      start_time: toWIB(setHours(setMinutes(new Date("2025-05-05"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-05-05"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    // BOOKING ID 6: 1X LAPANGAN 6
    {
      bookingId: 6,
      start_time: toWIB(setHours(setMinutes(new Date("2025-06-05"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-06-05"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    // BOOKING ID 7: 2X LAPANGAN 1
    {
      bookingId: 7,
      start_time: toWIB(setHours(setMinutes(new Date("2025-06-07"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-06-07"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    {
      bookingId: 7,
      start_time: toWIB(setHours(setMinutes(new Date("2025-06-07"), 0), 11)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-06-07"), 0), 12)),
      session_label: "11:00 - 12:00",
    },
    // Untuk (booking yang sudah dibayar)
    // BOOKING ID 8: 1X LAPANGAN 2
    {
      bookingId: 8,
      start_time: toWIB(setHours(setMinutes(new Date("2025-07-25"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-07-25"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    // BOOKING ID 9: 2X LAPANGAN 3
    {
      bookingId: 9,
      start_time: toWIB(setHours(setMinutes(new Date("2025-07-26"), 0), 10)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-07-26"), 0), 11)),
      session_label: "10:00 - 11:00",
    },
    {
      bookingId: 9,
      start_time: toWIB(setHours(setMinutes(new Date("2025-07-26"), 0), 11)),
      end_time: toWIB(setHours(setMinutes(new Date("2025-07-26"), 0), 12)),
      session_label: "11:00 - 12:00",
    },
  ];

  for (const session of sessionData) {
    await prisma.bookingSessions.create({
      data: session,
    });
  }

  console.log("✅ Seed booking sessions selesai");
}

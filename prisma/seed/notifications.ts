import { NotificationType, PrismaClient } from "@prisma/client";
import { subDays, subHours } from "date-fns";

export default async function seedNotifications(prisma: PrismaClient) {
  const today = new Date();

  const notificationData = [
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: true,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 1,
      message: "Terima Kasih telah mereview lapangan kami!",
      type: NotificationType.completed,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 2,
      message: "Terima Kasih telah menggunakan layanan booking kami! Silahkan review lapangan kami!",
      type: NotificationType.review,
      target_id: null,
      is_read: false,
      created_at: subDays(today, 1),
      updated_at: subDays(today, 1),
    },
    {
      userId: 2,
      message: "Pembayaran berhasil. Booking Anda sedang diverifikasi oleh Admin. Mohon ditunggu!",
      type: NotificationType.paid,
      target_id: null,
      is_read: false,
      created_at: today,
      updated_at: today,
    },
    {
      userId: 3,
      message: "Pembayaran berhasil. Booking Anda sedang diverifikasi oleh Admin. Mohon ditunggu!",
      type: NotificationType.paid,
      target_id: null,
      is_read: false,
      created_at: subHours(today, 5),
      updated_at: subHours(today, 5),
    },
  ];

  for (const notification of notificationData) {
    await prisma.notifications.create({ data: notification });
  }

  console.log("✅ Seed notifications selesai");
}

import { PaymentMethod, PrismaClient, TransactionStatus } from "@prisma/client";
import { subDays } from "date-fns";

export default async function seedTransactions(prisma: PrismaClient) {
  const today = new Date();

  // Dummy data transaksi berdasarkan bookingId tertentu
  const transactionData = [
    {
      bookingId: 1,
      amount: 300000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.BCA,
      payment_proof: "BCA.png",
      payment_time: subDays(today, 3),
      created_at: subDays(today, 4),
      updated_at: subDays(today, 3),
    },
    {
      bookingId: 2,
      amount: 140000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.Dana,
      payment_proof: "DANA.png",
      payment_time: subDays(today, 2),
      created_at: subDays(today, 3),
      updated_at: subDays(today, 2),
    },
    {
      bookingId: 3,
      amount: 260000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.Ovo,
      payment_proof: "OVO.png",
      payment_time: subDays(today, 1),
      created_at: subDays(today, 2),
      updated_at: subDays(today, 1),
    },
    {
      bookingId: 4,
      amount: 480000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.BRI,
      payment_proof: "BRI.png",
      payment_time: today,
      created_at: subDays(today, 1),
      updated_at: today,
    },
    {
      bookingId: 5,
      amount: 400000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.Shopeepay,
      payment_proof: "Shopeepay.png",
      payment_time: subDays(today, 5),
      created_at: subDays(today, 6),
      updated_at: subDays(today, 5),
    },
    {
      bookingId: 6,
      amount: 170000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.LinkAja,
      payment_proof: "LinkAja.png",
      payment_time: subDays(today, 2),
      created_at: subDays(today, 3),
      updated_at: subDays(today, 2),
    },
    {
      bookingId: 7,
      amount: 300000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.Mandiri,
      payment_proof: "Mandiri.png",
      payment_time: subDays(today, 7),
      created_at: subDays(today, 8),
      updated_at: subDays(today, 7),
    },
    {
      bookingId: 8,
      amount: 140000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.BRI,
      payment_proof: "BRI2.png",
      payment_time: today,
      created_at: today,
      updated_at: today,
    },
    {
      bookingId: 9,
      amount: 260000,
      status: TransactionStatus.paid,
      payment_method: PaymentMethod.BNI,
      payment_proof: "BNI.png",
      payment_time: today,
      created_at: today,
      updated_at: today,
    },
  ];

  for (const tx of transactionData) {
    await prisma.transactions.create({ data: tx });
  }

  console.log("✅ Seed transactions selesai");
}

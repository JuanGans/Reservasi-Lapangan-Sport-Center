// ENUM UNTUK PAYMENT METHOD
export type PaymentMethod = "Cash" | "Ovo" | "Dana" | "Gopay" | "LinkAja" | "Shopeepay" | "BNI" | "BCA" | "BRI" | "Mandiri";

// ENUM UNTUK STATUS TRANSAKSI
export type TransactionStatus = "pending" | "paid" | "failed" | "expired" | "refunded";

// TYPE UNTUK TRANSAKSI
export type Transaction = {
  id: number;
  bookingId: number;
  amount: number;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  payment_proof?: string | null;
  payment_time?: Date | null;
  created_at: Date;
  updated_at: Date;
};

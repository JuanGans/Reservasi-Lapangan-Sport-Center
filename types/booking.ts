import { BookingSession } from "./bookingSession";

export type BookingStatus = "all" | "pending" | "paid" | "confirmed" | "canceled" | "expired" | "review" | "completed";

// Struktur booking utama
export type Booking = {
  id: number;
  booking_date: string;
  booking_status: BookingStatus;
  total_price: number;
  created_at: string;
  expired_at: string;
  user?: {
    id: number;
    username: string;
    fullname: string;
    email: string;
    no_hp: string;
    user_img: string;
    role: string;
  };
  facility?: {
    id: number;
    field_name: string;
    field_image?: string;
  };
  transaction?: {
    id: number;
    payment_method: string;
    payment_proof: string;
  };
  sessions?: BookingSession[];
};

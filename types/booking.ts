import { BookingSession } from "./bookingSession";

export type BookingStatus = "pending" | "paid" | "canceled" | "expired" | "completed";

// Struktur booking utama
export type Booking = {
  id: number;
  booking_date: string;
  booking_status: BookingStatus;
  total_price: number;
  created_at: string;
  expired_at: string;
  user?: {
    email: string;
    username: string;
    no_hp: string;
    user_img: string;
    role: string;
  };
  facility?: {
    id: number;
    field_name: string;
    field_image?: string;
  };
  sessions?: BookingSession[];
};

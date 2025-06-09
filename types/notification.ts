export type NotificationType = "info" | "booking" | "payment" | "paid" | "confirmed" | "canceled" | "review" | "completed";

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const icons = {
  info: "fas fa-info-circle text-blue-500",
  booking: "fas fa-calendar-check text-purple-500",
  payment: "fas fa-credit-card text-indigo-500",
  paid: "fas fa-check-circle text-green-500",
  confirmed: "fas fa-check-circle text-green-500",
  canceled: "fas fa-times-circle text-red-500",
  review: "fas fa-comment text-yellow-500",
  completed: "fas fa-check-circle text-green-500",
};

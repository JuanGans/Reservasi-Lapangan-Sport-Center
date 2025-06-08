export type BookingSession = {
  id: number;
  start_time: string; // ISO String
  end_time: string; // ISO String
  session_label: string; // Opsional jika kamu menyimpannya di DB
};

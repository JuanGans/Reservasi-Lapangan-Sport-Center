import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { userId, facilityId, bookingDate, startTime, endTime } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO bookings (user_id, facility_id, booking_date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [userId, facilityId, bookingDate, startTime, endTime]
    );

    res.status(201).json({
      id: result.insertId,
      userId,
      facilityId,
      bookingDate,
      startTime,
      endTime,
      status: "pending"
    });
  } catch (error) {
    res.status(500).json({ error: "Booking failed", detail: error.message });
  }
}

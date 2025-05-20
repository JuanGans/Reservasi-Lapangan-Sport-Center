import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root", // Ganti sesuai user
      password: "", // Ganti sesuai password
      database: "futsal_management",
    });

    const [rows] = await connection.execute("SELECT * FROM bookings");

    const bookings = rows.map((row) => ({
      ...row,
      time_slots: row.time_slots ? JSON.parse(row.time_slots) : [],
    }));

    await connection.end();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

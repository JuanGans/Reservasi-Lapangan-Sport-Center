// pages/api/bookings/update-status.js
import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed. Gunakan metode PUT." });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "ID dan status wajib diisi." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservasi tidak ditemukan." });
    }

    return res.status(200).json({
      success: true,
      message: `Status berhasil diperbarui menjadi '${status}'.`,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({ error: "Gagal memperbarui status. Silakan coba lagi." });
  }
}

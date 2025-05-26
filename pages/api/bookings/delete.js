// pages/api/bookings/delete.js
import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed. Gunakan metode DELETE." });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID reservasi wajib diisi." });
  }

  try {
    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservasi tidak ditemukan atau sudah dihapus." });
    }

    return res.status(200).json({
      success: true,
      message: "Reservasi berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return res.status(500).json({ error: "Gagal menghapus reservasi. Silakan coba lagi." });
  }
}

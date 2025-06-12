// pages/api/catalog/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

interface Field {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string;
  price_per_session: string; // string decimal
  avg_rating?: number;
  total_review?: number;
}

export default async function getCatalogById(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    const db = connectDB();
    const [rows] = await db.execute("SELECT * FROM Facilities WHERE id = ?", [id]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "Lapangan tidak ditemukan" });
    }

    const field = rows[0] as Field;

    res.status(200).json({
      id: field.id,
      field_name: field.field_name,
      field_image: field.field_image,
      field_desc: field.field_desc,
      price_per_session: field.price_per_session,
      avg_rating: field.avg_rating,
      total_review: field.total_review,
    });
  } catch (error) {
    console.error("Gagal mengambil detail catalog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

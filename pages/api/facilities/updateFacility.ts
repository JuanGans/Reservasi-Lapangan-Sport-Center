import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";
import { connectDB } from "@/lib/db";

// Definisikan tipe data yang akan dikembalikan
type Data = {
  message?: string;
  id?: number;
  field_name?: string;
  field_desc?: string;
  field_image?: string;
  price_per_session?: string;
};

// Konfigurasi API untuk tidak menggunakan bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fungsi untuk parse form data
export function parseForm(req: IncomingMessage): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/assets/field"),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Handler untuk mengupdate fasilitas
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Cek jika request tidak menggunakan metode POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse form data
    const { fields, files } = await parseForm(req);

    // Mengambil data dari fields
    const id = parseInt(fields.id?.toString() || "");
    const field_name = fields.field_name?.toString() || "";
    const field_desc = fields.field_desc?.toString() || "";
    const price_per_session = parseInt(fields.price_per_session?.toString() || "");

    // Validasi data
    if (!id || !field_name || !field_desc || isNaN(price_per_session)) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Koneksi ke database
    const db = connectDB();

    // Cari fasilitas berdasarkan id
    const [rows]: any = await db.execute("SELECT * FROM Facilities WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }

    // Mengupdate fasilitas
    const oldFacility = rows[0];
    let imagePath: string | undefined;

    // Jika ada file gambar baru, update gambar
    if (files.field_image) {
      const file = Array.isArray(files.field_image) ? files.field_image[0] : files.field_image;

      // Hapus gambar lama jika ada
      if (oldFacility.field_image) {
        const oldImagePathOnDisk = path.join(process.cwd(), "public/assets/field", oldFacility.field_image);
        if (fs.existsSync(oldImagePathOnDisk)) {
          fs.unlinkSync(oldImagePathOnDisk);
        }
      }

      // Rename file gambar baru
      const oldPath = file.filepath;
      const newFileName = `${Date.now()}_${file.originalFilename}`;
      const newPath = path.join(process.cwd(), "public/assets/field", newFileName);

      fs.renameSync(oldPath, newPath);

      // Update path gambar baru
      imagePath = newFileName;
    }

    // Query untuk mengupdate fasilitas
    const updateQuery = imagePath ? `UPDATE Facilities SET field_name = ?, field_desc = ?, price_per_session = ?, field_image = ? WHERE id = ?` : `UPDATE facilities SET field_name = ?, field_desc = ?, price_per_session = ? WHERE id = ?`;

    // Parameter untuk query update
    const updateParams = imagePath ? [field_name, field_desc, price_per_session, imagePath, id] : [field_name, field_desc, price_per_session, id];

    // Eksekusi query update
    await db.execute(updateQuery, updateParams);

    // Ambil data fasilitas yang telah diupdate
    const [updatedRows]: any = await db.execute("SELECT * FROM Facilities WHERE id = ?", [id]);
    const updated = updatedRows[0];

    // Kembalikan data fasilitas yang telah diupdate
    return res.status(200).json({
      id: updated.id,
      field_name: updated.field_name,
      field_desc: updated.field_desc,
      field_image: updated.field_image,
      price_per_session: updated.price_per_session,
    });
  } catch (error) {
    console.error("Error updateFacility:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

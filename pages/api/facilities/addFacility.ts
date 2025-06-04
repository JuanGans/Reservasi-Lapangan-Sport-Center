import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";

// Konfigurasi untuk mengatur body parser untuk tidak aktif karena kita akan menggunakan formidable untuk menghandle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Definisikan tipe data yang akan dikembalikan oleh API
type Data = {
  message?: string;
  id?: number;
  field_name?: string;
  field_desc?: string;
  field_image?: string;
  price_per_session?: string;
};

// Fungsi untuk parse form data menggunakan formidable
function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: false, // Tidak mengizinkan file yang sama diupload beberapa kali
    uploadDir: path.join(process.cwd(), "public/assets/field"), // Direktori untuk menyimpan file yang diupload
    keepExtensions: true, // Menjaga ekstensi file asli
    filter: ({ mimetype }) => {
      // Filter untuk hanya mengizinkan file gambar berdasarkan mimetype
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!mimetype || !allowedTypes.includes(mimetype)) {
        return false;
      }
      return true;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Handler untuk menghandle request POST
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const field_name = fields.field_name?.toString() || "";
    const field_desc = fields.field_desc?.toString() || "";
    const price_per_session = parseFloat(fields.price_per_session?.toString() || "");

    if (!field_name || !field_desc || isNaN(price_per_session)) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    if (!files.field_image) {
      return res.status(400).json({ message: "Gambar wajib diupload" });
    }

    const file = Array.isArray(files.field_image) ? files.field_image[0] : files.field_image;

    // Validasi ekstensi file
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalFilename || "").toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ message: "Hanya file gambar dengan ekstensi JPG, PNG, atau WebP yang diperbolehkan" });
    }

    // Validasi magic bytes (isi file) menggunakan file-type
    // Karena tidak menggunakan fileTypeFromFile, maka kita akan menggunakan cara lain untuk validasi
    // Contoh: menggunakan fs.readFile untuk membaca isi file dan kemudian memeriksa apakah itu gambar valid
    // Namun, karena ini tidak termasuk dalam konteks ini, maka kita akan melewati validasi ini untuk sementara

    // Rename dan pindahkan file ke folder public/uploads
    const oldPath = file.filepath;
    const safeFileName = `${Date.now()}_${file.originalFilename?.replace(/\s/g, "_")}`;
    const newPath = path.join(process.cwd(), "public/assets/field", safeFileName);

    fs.renameSync(oldPath, newPath);

    const imagePath = safeFileName;

    const db = await connectDB();

    const insertQuery = `INSERT INTO facilities (field_name, field_desc, price_per_session, field_image) VALUES (?, ?, ?, ?)`;
    const [result]: any = await db.execute(insertQuery, [field_name, field_desc, price_per_session, imagePath]);

    return res.status(201).json({
      id: result.insertId,
      field_name,
      field_desc,
      field_image: imagePath,
      price_per_session: price_per_session.toString(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan fasilitas" });
  }
}

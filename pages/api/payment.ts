import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";
import db from "@/lib/db"; // Sesuaikan dengan path

// Konfigurasi upload
const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper untuk jalankan middleware multer
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.single("proof"));

      const { bookingId, amount } = req.body;
      const proofImage = (req as any).file?.filename;

      if (!bookingId || !amount || !proofImage) {
        return res.status(400).json({ message: "Data tidak lengkap." });
      }

      const description = `Pembayaran booking ID ${bookingId}, bukti: ${proofImage}`;

      await db.query(
        "INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)",
        ["income", amount, description]
      );

      return res.status(200).json({ message: "Bukti pembayaran berhasil dikirim." });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Gagal menyimpan ke database.", detail: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Jangan lupa:
export const config = {
  api: {
    bodyParser: false,
  },
};

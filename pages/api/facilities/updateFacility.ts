import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";
import { connectDB } from "@/lib/db";

type Data = {
  message?: string;
  id?: number;
  field_name?: string;
  field_desc?: string;
  field_image?: string;
  price_per_session?: number;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export function parseForm(req: IncomingMessage): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const id = parseInt(fields.id?.toString() || "");
    const field_name = fields.field_name?.toString() || "";
    const field_desc = fields.field_desc?.toString() || "";
    const price_per_session = parseInt(fields.price_per_session?.toString() || "");

    if (!id || !field_name || !field_desc || isNaN(price_per_session)) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const db = await connectDB();

    const [rows]: any = await db.execute("SELECT * FROM facilities WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }

    const oldFacility = rows[0];
    let imagePath: string | undefined;

    if (files.field_image) {
      const file = Array.isArray(files.field_image) ? files.field_image[0] : files.field_image;

      if (oldFacility.field_image) {
        const oldImagePathOnDisk = path.join(process.cwd(), "public", oldFacility.field_image);
        if (fs.existsSync(oldImagePathOnDisk)) {
          fs.unlinkSync(oldImagePathOnDisk);
        }
      }

      const oldPath = file.filepath;
      const newFileName = `${Date.now()}_${file.originalFilename}`;
      const newPath = path.join(process.cwd(), "public/uploads", newFileName);

      fs.renameSync(oldPath, newPath);

      imagePath = `/uploads/${newFileName}`;
    }

    const updateQuery = imagePath
      ? `UPDATE facilities SET field_name = ?, field_desc = ?, price_per_session = ?, field_image = ? WHERE id = ?`
      : `UPDATE facilities SET field_name = ?, field_desc = ?, price_per_session = ? WHERE id = ?`;

    const updateParams = imagePath
      ? [field_name, field_desc, price_per_session, imagePath, id]
      : [field_name, field_desc, price_per_session, id];

    await db.execute(updateQuery, updateParams);

    const [updatedRows]: any = await db.execute("SELECT * FROM facilities WHERE id = ?", [id]);
    const updated = updatedRows[0];

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

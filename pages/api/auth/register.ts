import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ message: "Form parsing error" });
    }

    const fullname = Array.isArray(fields.fullname) ? fields.fullname[0] : fields.fullname;
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;
    const no_hp = Array.isArray(fields.no_hp) ? fields.no_hp[0] : fields.no_hp;

    if (!fullname || !username || !email || !password || !no_hp) {
      return res.status(400).json({ message: "Semua kolom wajib diisi" });
    }

    try {
      const connection = connectDB();
      const [usernameRows] = await connection.execute("SELECT id FROM Users WHERE username = ?", [username]);
      const [emailRows] = await connection.execute("SELECT id FROM Users WHERE email = ?", [email]);

      if (Array.isArray(usernameRows) && usernameRows.length > 0) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }

      if (Array.isArray(emailRows) && emailRows.length > 0) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const uploadDir = path.join(process.cwd(), "public/assets/user");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let user_img = "default-user.jpg"; // default

      if (files.user_img) {
        const uploadedFile = Array.isArray(files.user_img) ? files.user_img[0] : files.user_img;

        const tempFilePath = uploadedFile.filepath;
        const originalFilename = uploadedFile.originalFilename || "unknown.jpg";
        const newFilename = `${Date.now()}_${originalFilename.replace(/\s/g, "_")}`;
        const newFilePath = path.join(uploadDir, newFilename);

        try {
          await fsPromises.copyFile(tempFilePath, newFilePath);
          // Hindari langsung unlink — biarkan OS handle cleanup atau hapus nanti

          // fs.copyFileSync(tempFilePath, newFilePath);
          // fs.unlinkSync(tempFilePath); // Hapus file sementara dari /tmp
          user_img = newFilename;
        } catch (err) {
          console.error("Gagal menyalin file:", err);
          return res.status(500).json({ message: "Gagal menyimpan gambar" });
        }
      }

      await connection.execute("INSERT INTO Users (fullname, username, email, password, no_hp, user_img) VALUES (?, ?, ?, ?, ?, ?)", [fullname, username, email, hashedPassword, no_hp, user_img]);

      return res.status(201).json({ message: "Registrasi berhasil" });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
}

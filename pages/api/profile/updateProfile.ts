import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getUserFromToken } from "@/lib/getUserFromToken";

interface UserImage extends RowDataPacket {
  user_img: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  let decoded: any;
  try {
    decoded = getUserFromToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  let fields: formidable.Fields;
  let files: formidable.Files;

  try {
    const parsedData = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    fields = parsedData.fields;
    files = parsedData.files;
  } catch (err) {
    console.error("Form parse error:", err);
    return res.status(500).json({ message: "Form parsing error" });
  }

  const id = decoded.id;
  const fullname = Array.isArray(fields.fullname) ? fields.fullname[0] : fields.fullname;
  const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
  const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
  const no_hp = Array.isArray(fields.no_hp) ? fields.no_hp[0] : fields.no_hp;

  try {
    const db = connectDB();

    const [existingRows] = (await db.execute("SELECT user_img FROM Users WHERE id = ?", [id])) as [UserImage[], any];
    const existingUser = existingRows[0];

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cek apakah username sudah dipakai user lain selain user ini
    const [usernameCheckRows]: any = await db.execute("SELECT id FROM Users WHERE username = ? AND id != ?", [username, id]);

    if (Array.isArray(usernameCheckRows) && usernameCheckRows.length > 0) {
      return res.status(409).json({ message: "Username sudah digunakan oleh pengguna lain" });
    }

    let user_img = existingUser.user_img;
    const uploadDir = path.join(process.cwd(), "public/assets/user");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (files.user_img) {
      const file = Array.isArray(files.user_img) ? files.user_img[0] : files.user_img;
      const filename = `${Date.now()}_${file.originalFilename!.replace(/\s/g, "_")}`;
      const filepath = path.join(uploadDir, filename);

      fs.copyFileSync(file.filepath, filepath);
      user_img = filename;

      if (existingUser.user_img && existingUser.user_img !== "default-user.jpg") {
        const oldFilePath = path.join(uploadDir, existingUser.user_img);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.execute("UPDATE Users SET fullname = ?, username = ?, email = ?, no_hp = ?, user_img = ? WHERE id = ?", [fullname, username, email, no_hp, user_img, id]);

    const [rows]: any = await db.execute("SELECT id, fullname, username, email, no_hp, user_img, role FROM Users WHERE id = ?", [id]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: "User not found after update" });
    }

    return res.status(200).json(rows[0]);
  } catch (e) {
    console.error("Update error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { RowDataPacket } from "mysql2";

interface UserData extends RowDataPacket {
  id: number;
  fullname: string;
  username: string;
  email: string;
  no_hp: string;
  user_img: string;
  role: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const user = token ? getUserFromToken(token) : null;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const db = connectDB();
    const [rows] = (await db.execute("SELECT id, fullname, username, email, no_hp, user_img, role FROM users WHERE id = ?", [user.id])) as [UserData[], any];

    return res.status(200).json(rows[0]); // akan mengandung id, fullname, email, username, no_hp, role
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

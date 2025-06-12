import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    const db = connectDB();
    const [rows] = await db.query("SELECT * FROM Facilities");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

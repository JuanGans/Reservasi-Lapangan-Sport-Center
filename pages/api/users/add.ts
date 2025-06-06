    import type { NextApiRequest, NextApiResponse } from "next";
    import { connectDB } from "@/lib/db";
    import bcrypt from "bcrypt";

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { fullname, username, email, role, password, no_hp, imageUrl } = req.body;

        console.log("Received data:", { fullname, username, email, role, no_hp });

        if (
        !fullname?.trim() ||
        !username?.trim() ||
        !email?.trim() ||
        !password?.trim() ||
        !no_hp?.trim()
        ) {
        return res.status(400).json({ message: "Data wajib diisi lengkap" });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        const db = await connectDB();

        const [result] = await db.execute(
        `INSERT INTO users (fullname, username, email, role, password, no_hp, user_img) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fullname, username, email, role, hashedPassword, no_hp, imageUrl || "/assets/user/default-user.jpg"]
        );

        const insertedId = (result as any).insertId;

        return res.status(201).json({
        id: insertedId,
        fullname,
        username,
        email,
        role,
        no_hp,
        imageUrl: imageUrl || "/assets/user/default-user.jpg",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
    }

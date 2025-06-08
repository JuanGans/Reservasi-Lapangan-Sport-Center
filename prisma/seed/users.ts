import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export default async function seedUsers(prisma: PrismaClient) {
  // SEEDER USER
  const users = [
    {
      fullname: "Pak Tua Gimang",
      email: "paktua@example.com",
      username: "paktua",
      password: "paktua123",
      no_hp: "081234567890",
      user_img: "user1.png",
      role: "member",
    },
    {
      fullname: "Agung Andi Prakasa",
      email: "agung123@example.com",
      username: "agungandi",
      password: "agung123",
      no_hp: "082345678901",
      user_img: "user2.png",
      role: "member",
    },
    {
      fullname: "Leni Ayu Novitasari",
      email: "leni123@example.com",
      username: "leniayu",
      password: "leni123",
      no_hp: "082345678901",
      user_img: "user3.png",
      role: "member",
    },
    {
      fullname: "User Member",
      email: "user@example.com",
      username: "usermember",
      password: "user123",
      no_hp: "082345678901",
      user_img: "user4.png",
      role: "member",
    },
    {
      fullname: "Member User",
      email: "member@example.com",
      username: "memberuser",
      password: "member123",
      no_hp: "082345678901",
      user_img: "user5.png",
      role: "member",
    },
    {
      fullname: "Admin User",
      email: "admin@example.com",
      username: "adminuser",
      password: "admin123",
      no_hp: "083456789012",
      user_img: "adminganteng.png",
      role: "admin",
    },
  ];

  // LOOPING DATA USER
  for (const user of users) {
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // UPSERT USER
    await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        password: hashedPassword,
        no_hp: user.no_hp,
        user_img: user.user_img,
        role: user.role as Role,
      },
    });
  }

  console.log("✅ Seed users berhasil");
}

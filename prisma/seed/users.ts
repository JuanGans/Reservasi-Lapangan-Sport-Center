import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export default async function seedUsers(prisma: PrismaClient) {
  // SEEDER USER
  const users = [
    {
      fullname: "Member User",
      email: "member@example.com",
      username: "memberuser",
      password: "member123",
      no_hp: "081234567890",
      user_img: "imam2.jpg",
      role: "member",
    },
    {
      fullname: "User Member",
      email: "user@example.com",
      username: "usermember",
      password: "user123",
      no_hp: "082345678901",
      user_img: "imam2.jpg",
      role: "member",
    },
    {
      fullname: "Admin User",
      email: "admin@example.com",
      username: "adminuser",
      password: "admin123",
      no_hp: "083456789012",
      user_img: "imam.jpg",
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

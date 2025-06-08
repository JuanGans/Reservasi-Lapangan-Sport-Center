// pages/api/reviews.ts (Next.js API route)
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const facilityId = parseInt(req.query.id as string);

  if (isNaN(facilityId)) {
    return res.status(400).json({ error: "Invalid facility ID" });
  }

  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        booking: {
          facilityId: facilityId,
        },
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        booking: {
          select: {
            user: {
              select: {
                username: true,
                user_img: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Format response
    const formatted = reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      username: review.booking.user.username,
      user_img: review.booking.user.user_img,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

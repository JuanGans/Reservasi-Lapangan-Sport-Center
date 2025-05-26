// pages/api/auth/logout.ts
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const expired = req.query.expired === "1";

  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      expires: new Date(0),
      // secure: false,
      secure: process.env.NODE_ENV === "production",
    })
  );

  // Redirect ke landing page
  const target = expired ? "/?expired=1" : "/?logout=1";
  res.writeHead(302, { Location: target });
  res.end();
}

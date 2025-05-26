import { verify } from "jsonwebtoken";

export function getUserFromToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET!) as { id: number; role: string };
  } catch (err) {
    return null;
  }
}

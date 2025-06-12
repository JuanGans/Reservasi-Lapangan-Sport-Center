// lib/db.ts
import mysql from "mysql2/promise";

let cached = (global as any).mysql;

if (!cached) {
  cached = (global as any).mysql = {};
}

export const connectDB = () => {
  if (!cached.pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not set");
    }
    cached.pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return cached.pool;
};

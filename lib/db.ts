// lib/connectDB.ts
import mysql from "mysql2/promise";

let cached = (global as any).mysql;

if (!cached) {
  cached = (global as any).mysql = {};
}

export const connectDB = () => {
  if (!cached.pool) {
    cached.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return cached.pool;
};

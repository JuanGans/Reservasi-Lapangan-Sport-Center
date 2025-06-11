// lib/db.ts
import mysql from "mysql2/promise";

let cached = (global as any).mysql;

if (!cached) {
  cached = (global as any).mysql = {};
}

export const connectDB = () => {
  if (!cached.pool) {
    cached.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT || "3306", 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return cached.pool;
};

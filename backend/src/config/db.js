import { neon } from "@neondatabase/serverless";

import "dotenv/config";

//this will create SQL connection using our database url.
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
    console.log("database initialized successfully.");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
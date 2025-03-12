import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("[DEBUG dbConnect] Databasen har kontakt!");
    client.release();
  } catch (error) {
    console.error("[ERROR dbConnect] Database-kontakt feilet:", error);
  }
}

export default pool;

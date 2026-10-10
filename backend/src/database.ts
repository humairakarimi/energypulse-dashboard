import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_POOLED;

if (!connectionString) {
  throw new Error("DATABASE_URL_POOLED is missing from the .env file.");
}

const database = new Pool({
  connectionString,
});

export default database;
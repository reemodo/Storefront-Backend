import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  NODE_ENV,
} = process.env;
const client = new Pool({
  host: POSTGRES_HOST || "127.0.0.1",
  database: NODE_ENV === "test" ? POSTGRES_DB_TEST : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: 5432,
});
export default client;

import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "banti",
  password:"root",
  port: 5432,
});

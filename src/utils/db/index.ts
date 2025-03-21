import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Since pg may still support module.exports syntax
const { Pool } = pkg;

import * as schema from "../../schema.ts";

// Using pg's connection pooling so the API does not have to keep creating new connections to the db instance (adds to performance)

// you could also have the db host a pooling system externally (I have done that too)

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});

// { schema } is used for relational queries
export const db = drizzle(pool, { schema });

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const DB_PATH = "sqlite.db";

export const db = drizzle(new Database(DB_PATH));

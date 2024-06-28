import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { DEFAULT_DB_PATH } from "../constants";

export const db = drizzle(new Database(DEFAULT_DB_PATH));

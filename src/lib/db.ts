import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from 'better-sqlite3';
import { DEFAULT_DB_PATH } from "../constants";

export const db = drizzle(new Database(DEFAULT_DB_PATH));

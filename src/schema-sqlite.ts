import { integer, sqliteTable, text, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const user = sqliteTable("lab_user", {
  username: text("username", { length: 128 }).primaryKey(),
  // Primary password hashed via Argon2
  password: text("password", { length: 512 }),
  dateJoined: integer("date_joined").notNull().$defaultFn(() => Date.now()),
});

export const session = sqliteTable("session", {
  id: text("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID().toString()),
  title: text("title").notNull(),
  user: text("user", { length: 128 }).notNull()
    .references((): AnySQLiteColumn => user.username, { onDelete: "cascade", onUpdate: "cascade" }),
  dateCreated: integer("date_created").notNull().$defaultFn(() => Date.now()),
});

export const chat = sqliteTable("chat", {
  id: text("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID().toString()),
  role: text("role").notNull(),
  content: text("content").notNull(),
  session: text("session", { length: 36 }).notNull()
    .references((): AnySQLiteColumn => session.id, { onDelete: "cascade", onUpdate: "cascade" }),
  dateCreated: integer("date_created").notNull().$defaultFn(() => Date.now()),
  dateEdited: integer("date_edited"),
});

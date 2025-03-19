import { text, pgTable, serial, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
});


export const forum = pgTable("forum", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  email: text("email")
    .references(() => user.email) // references the email in the user table (foreign key)
    .notNull(),
});


export const question = pgTable("question", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // store options as a JSON array,
  type: text("type").notNull(),
  correctAnswer: text("correctanswer").notNull()
});

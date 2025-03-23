import { text, pgTable, serial, jsonb, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
});


export const forum = pgTable("forum", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  email: text("email")
    .references(() => user.email) 
    .notNull(),
  content: text("content").notNull()
});

export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),

  // foreign keys to properly associate comment w/ owner + post

  forumID: integer("forumid")
    .references(() => forum.id)
    .notNull(),
  email: text("email")
    .references(() => user.email)
    .notNull()
})

export const question = pgTable("question", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // store options as a JSON array,
  type: text("type").notNull(),
  correctAnswer: text("correctanswer").notNull()
});

export const bookmark = pgTable("bookmark", {
  id: serial("id").primaryKey(),
  email: text("email")
    .references(() => user.email)
    .notNull(),
  forumID: integer("forumid")
    .references(() => forum.id)
    .notNull(),
});
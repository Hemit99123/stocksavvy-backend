import { pgTable, text } from "drizzle-orm/pg-core";

const user = pgTable("user", {
    email: text("email").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(),
});

export default user;
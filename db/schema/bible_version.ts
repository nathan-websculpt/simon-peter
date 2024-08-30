import { InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { bible_book } from "$/db/schema";

export const bible_version = pgTable("bible_version", {
	id: serial("id").notNull().primaryKey(),
	title: varchar("title", { length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bibleVersionRelations = relations(bible_version, ({ many }) => ({
	bible_books: many(bible_book),
}));

const baseSchema = createInsertSchema(bible_version, {
	title: (schema) => schema.title.min(1),
}).pick({ title: true });

export const bibleVersionSchema = z.union([
	z.object({
		mode: z.literal("update"),
		title: baseSchema.shape.title,
	}),
]);

export type BibleVersionSchema = z.infer<typeof bibleVersionSchema>;
export type SelectBibleVersionModel = InferSelectModel<typeof bible_version>;
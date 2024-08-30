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

export const bible_testament = pgTable("bible_testament", {
	id: serial("id").notNull().primaryKey(),
	title: varchar("title", { length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bibleTestamentRelations = relations(bible_testament, ({ many }) => ({
	bible_books: many(bible_book),
}));

const baseSchema = createInsertSchema(bible_testament, {
	title: (schema) => schema.title.min(1),
}).pick({ title: true });

export const bibleTestamentSchema = z.union([
	z.object({
		mode: z.literal("update"),
		title: baseSchema.shape.title,
	}),
]);

export type BibleTestamentSchema = z.infer<typeof bibleTestamentSchema>;
export type SelectBibleTestamentModel = InferSelectModel<typeof bible_testament>;
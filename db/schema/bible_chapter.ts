import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { bible_book } from "$/db/schema";

export const bible_chapter = pgTable("bible_chapter", {
  id: serial("id").notNull().primaryKey(),
  bookId: integer("bible_book_id")
    .notNull()
    .references(() => bible_book.id),
  chapterNumber: integer("chapter_number").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bibleChapterRelations = relations(bible_chapter, ({ one, many }) => ({
  book: one(bible_book, {
    fields: [bible_chapter.bookId],
    references: [bible_book.id],
  }),
}));

const baseSchema = createInsertSchema(bible_chapter, {
  chapterNumber: (schema) => schema.chapterNumber.min(1),
  bookId: (schema) => schema.bookId.min(1),
}).pick({
  title: true,
  chapterNumber: true,
  versionId: true,
});

export const bibleChapterSchema = z.union([
  z.object({
    mode: z.literal("create"),
    title: baseSchema.shape.title,
    chapterNumber: baseSchema.shape.chapterNumber,
    bookId: baseSchema.shape.bookId,
  }),
  z.object({
    mode: z.literal("edit"),
    id: z.number().min(1),
    title: baseSchema.shape.title,
    chapterNumber: baseSchema.shape.chapterNumber,
    bookId: baseSchema.shape.bookId,
  }),
]);

export type BibleChapterSchema = z.infer<typeof bibleChapterSchema>;
export type SelectChapterBookModel = InferSelectModel<typeof bible_book>;

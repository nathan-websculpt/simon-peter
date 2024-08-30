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

import { bible_chapter } from "$/db/schema";
import { citext } from "../customTypes";

export const bible_verse = pgTable("bible_verse", {
  id: serial("id").notNull().primaryKey(),
  chapterId: integer("bible_chapter_id")
    .notNull()
    .references(() => bible_chapter.id),
  verseNumber: integer("verse_number").notNull(),
  verseContent: citext("verse_content").notNull(), // The longest verse in the Bible is Esther 8:9, which is 528 characters in the KJV; ci is case-insensitive text
  stringLength: integer("string_length").notNull(),
  fullVerseChapter: varchar("full_verse_chapter", { length: 10 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bibleVerseRelations = relations(bible_verse, ({ one, many }) => ({
  chapter: one(bible_chapter, {
    fields: [bible_verse.chapterId],
    references: [bible_chapter.id],
  }),
}));

const baseSchema = createInsertSchema(bible_verse, {
  verseNumber: (schema) => schema.verseNumber.min(1),
  chapterId: (schema) => schema.chapterId.min(1),
}).pick({
  verseNumber: true,
  chapterId: true,
});

export const bibleChapterSchema = z.union([
  z.object({
    mode: z.literal("create"),
    verseNumber: baseSchema.shape.verseNumber,
    chapterId: baseSchema.shape.chapterId,
  }),
  z.object({
    mode: z.literal("edit"),
    id: z.number().min(1),
    verseNumber: baseSchema.shape.verseNumber,
    chapterId: baseSchema.shape.chapterId,
  }),
]);

export type BibleChapterSchema = z.infer<typeof bibleChapterSchema>;
export type SelectChapterBookModel = InferSelectModel<typeof bible_chapter>;

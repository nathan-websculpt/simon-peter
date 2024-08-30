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

import { bible_testament, bible_version } from "$/db/schema";

export const bible_book = pgTable("bible_book", {
  id: serial("id").notNull().primaryKey(),
  versionId: integer("bible_version_id")
    .notNull()
    .references(() => bible_version.id),
  testamentId: integer("bible_testament_id")
    .notNull()
    .references(() => bible_testament.id),
  title: varchar("title", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bibleBookRelations = relations(bible_book, ({ one, many }) => ({
  version: one(bible_version, {
    fields: [bible_book.versionId],
    references: [bible_version.id],
  }),
  testament: one(bible_testament, {
    fields: [bible_book.testamentId],
    references: [bible_testament.id],
  }),
}));

const baseSchema = createInsertSchema(bible_book, {
  title: (schema) => schema.title.min(1),
  versionId: (schema) => schema.versionId.min(1),
  testamentId: (schema) => schema.testamentId.min(1),
}).pick({
  title: true,
  versionId: true,
});

export const bibleBookSchema = z.union([
  z.object({
    mode: z.literal("create"),
    title: baseSchema.shape.title,
    versionId: baseSchema.shape.versionId,
    testamentId: baseSchema.shape.testamentId,
  }),
  z.object({
    mode: z.literal("edit"),
    id: z.number().min(1),
    title: baseSchema.shape.title,
    versionId: baseSchema.shape.versionId,
    testamentId: baseSchema.shape.testamentId,
  }),
]);

export type BibleBookSchema = z.infer<typeof bibleBookSchema>;
export type SelectBibleBookModel = InferSelectModel<typeof bible_book>;

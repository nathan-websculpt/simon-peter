CREATE TABLE IF NOT EXISTS "bible_book" (
	"id" serial PRIMARY KEY NOT NULL,
	"bible_version_id" integer NOT NULL,
	"bible_testament_id" integer NOT NULL,
	"title" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_chapter" (
	"id" serial PRIMARY KEY NOT NULL,
	"bible_book_id" integer NOT NULL,
	"chapter_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_testament" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_verse" (
	"id" serial PRIMARY KEY NOT NULL,
	"bible_chapter_id" integer NOT NULL,
	"verse_number" integer NOT NULL,
	"verse_content" varchar(700) NOT NULL,
	"string_length" integer NOT NULL,
	"full_verse_chapter" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bible_version" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_book" ADD CONSTRAINT "bible_book_bible_version_id_bible_version_id_fk" FOREIGN KEY ("bible_version_id") REFERENCES "public"."bible_version"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_book" ADD CONSTRAINT "bible_book_bible_testament_id_bible_testament_id_fk" FOREIGN KEY ("bible_testament_id") REFERENCES "public"."bible_testament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_chapter" ADD CONSTRAINT "bible_chapter_bible_book_id_bible_book_id_fk" FOREIGN KEY ("bible_book_id") REFERENCES "public"."bible_book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bible_verse" ADD CONSTRAINT "bible_verse_bible_chapter_id_bible_chapter_id_fk" FOREIGN KEY ("bible_chapter_id") REFERENCES "public"."bible_chapter"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

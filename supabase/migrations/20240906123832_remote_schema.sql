

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."app_first_load"("version_title" "text", "book_title" "text") RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  min_chapter_id integer;
BEGIN
  -- get first chapter id in table that is in this version (EX: KJV)
  SELECT MIN(v.id) INTO min_chapter_id   
  FROM bible_verse v
  INNER JOIN bible_chapter c
    ON v.bible_chapter_id = c.id    
  INNER JOIN bible_book b
    ON c.bible_book_id = b.id
  INNER JOIN bible_version bv
    ON b.bible_version_id = bv.id
  WHERE bv.title = version_title;



 RETURN 
 QUERY
 SELECT json_build_object(
  'book', (
    SELECT (row_to_json(q1))
    FROM (
      -- Query here
      SELECT b.id, b.title 
      from bible_book b
      LEFT JOIN bible_chapter c
      ON b.id = c.bible_book_id
    WHERE c.id = min_chapter_id
    ) q1
  ),
  'chapter', (
    SELECT (row_to_json(q2))
    FROM (
      -- Query here
      SELECT c.id, c.chapter_number
      from bible_chapter c
    WHERE c.id = min_chapter_id
    ) q2
  ),
  'books', (
    SELECT json_agg(row_to_json(q3))
    FROM (
      -- Your first query here
      SELECT b.id, b.title 
      from bible_book b
      ORDER BY b.id asc
    ) q3
  ),
  'verses', (
    SELECT json_agg(row_to_json(q4))
    FROM (
      -- Your second query here
      select v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
    WHERE v.bible_chapter_id = min_chapter_id
    ORDER BY v.id asc
    ) q4
  )
) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."app_first_load"("version_title" "text", "book_title" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_chapters_by_book_id"("book_id" integer) RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

return
query
  SELECT json_build_object(
  'chapters', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      SELECT c.id, c.chapter_number 
      from bible_chapter c
      where c.bible_book_id = book_id
      ORDER BY c.chapter_number
    ) q1
  )
) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."get_chapters_by_book_id"("book_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_chapter"("chapter_id" integer) RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  next_chapter_id integer;
  max_chapter_id integer;
BEGIN
  -- get last chapter in table
  SELECT MAX(c.id) INTO max_chapter_id
  FROM bible_chapter c;

IF chapter_id = max_chapter_id THEN
  next_chapter_id := chapter_id;
ELSE
SELECT MIN(c.id) INTO next_chapter_id
FROM bible_chapter c
WHERE c.id > chapter_id;
END IF;

return
query
  SELECT json_build_object(
  'book', (
    SELECT (row_to_json(q1))
    FROM (
      -- Query here
      SELECT b.id, b.title 
      from bible_book b
      LEFT JOIN bible_chapter c
      ON b.id = c.bible_book_id
    WHERE c.id = next_chapter_id
    ) q1
  ),
  'chapter', (
    SELECT (row_to_json(q2))
    FROM (
      -- Query here
      SELECT c.id, c.chapter_number
      from bible_chapter c
    WHERE c.id = next_chapter_id
    ) q2
  ),
  'verses', (
    SELECT json_agg(row_to_json(q3))
    FROM (
      SELECT v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
      where v.bible_chapter_id = next_chapter_id
    ORDER BY v.id asc
    ) q3
  )
) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."get_next_chapter"("chapter_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_prev_chapter"("chapter_id" integer) RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  prev_chapter_id integer;
  min_chapter_id integer;
BEGIN
  -- get first chapter in table
  SELECT MIN(c.id) INTO min_chapter_id
  FROM bible_chapter c;

IF chapter_id = min_chapter_id THEN  
  prev_chapter_id := chapter_id;
ELSE
  SELECT MAX(c.id) INTO prev_chapter_id
  FROM bible_chapter c
  WHERE c.id < chapter_id;
  END IF;

  return
  query
    SELECT json_build_object(
  'book', (
    SELECT (row_to_json(q1))
    FROM (
      -- Query here
      SELECT b.id, b.title 
      from bible_book b
      LEFT JOIN bible_chapter c
      ON b.id = c.bible_book_id
    WHERE c.id = prev_chapter_id
    ) q1
  ),
  'chapter', (
    SELECT (row_to_json(q2))
    FROM (
      -- Query here
      SELECT c.id, c.chapter_number
      from bible_chapter c
    WHERE c.id = prev_chapter_id
    ) q2
  ),
    'verses', (
      SELECT json_agg(row_to_json(q3))
      FROM (
        SELECT v.id, v.verse_content, v.full_verse_chapter
        from bible_verse v
        where v.bible_chapter_id = prev_chapter_id
    ORDER BY v.id asc
      ) q3
    )
  ) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."get_prev_chapter"("chapter_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_verses_by_chapter_id"("chapter_id" integer) RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

return
query
  SELECT json_build_object(
  'book', (
    SELECT (row_to_json(q1))
    FROM (
      -- Query here
      SELECT b.id, b.title 
      from bible_book b
      LEFT JOIN bible_chapter c
      ON b.id = c.bible_book_id
    WHERE c.id = chapter_id
    ) q1
  ),
  'chapter', (
    SELECT (row_to_json(q2))
    FROM (
      -- Query here
      SELECT c.id, c.chapter_number
      from bible_chapter c
    WHERE c.id = chapter_id
    ) q2
  ),
  'verses', (
    SELECT json_agg(row_to_json(q3))
    FROM (
      SELECT v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
      where v.bible_chapter_id = chapter_id
    ORDER BY v.id asc
    ) q3
  )
) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."get_verses_by_chapter_id"("chapter_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_fts"("search_by" character varying) RETURNS SETOF "json"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

return
query
  SELECT json_build_object(
  'verses', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      select v.id, b.id as book_id, b.title as book_title, v.full_verse_chapter, v.verse_content
      from bible_verse v
      LEFT JOIN bible_chapter c
      ON v.bible_chapter_id = c.id
      LEFT JOIN bible_book b
      ON c.bible_book_id = b.id
      where fts_doc_en @@ to_tsquery(search_by)
    ) q1
  )
) AS combined_results;
  
END;
$$;


ALTER FUNCTION "public"."search_fts"("search_by" character varying) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."bible_book" (
    "id" integer NOT NULL,
    "bible_version_id" integer NOT NULL,
    "bible_testament_id" integer NOT NULL,
    "title" character varying(50) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bible_book" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bible_book_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bible_book_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bible_book_id_seq" OWNED BY "public"."bible_book"."id";



CREATE TABLE IF NOT EXISTS "public"."bible_chapter" (
    "id" integer NOT NULL,
    "bible_book_id" integer NOT NULL,
    "chapter_number" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bible_chapter" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bible_chapter_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bible_chapter_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bible_chapter_id_seq" OWNED BY "public"."bible_chapter"."id";



CREATE TABLE IF NOT EXISTS "public"."bible_testament" (
    "id" integer NOT NULL,
    "title" character varying(50) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bible_testament" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bible_testament_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bible_testament_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bible_testament_id_seq" OWNED BY "public"."bible_testament"."id";



CREATE TABLE IF NOT EXISTS "public"."bible_verse" (
    "id" integer NOT NULL,
    "bible_chapter_id" integer NOT NULL,
    "verse_number" integer NOT NULL,
    "verse_content" "public"."citext" NOT NULL,
    "string_length" integer NOT NULL,
    "full_verse_chapter" character varying(10) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "fts_doc_en" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ("verse_content")::"text")) STORED
);


ALTER TABLE "public"."bible_verse" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bible_verse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bible_verse_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bible_verse_id_seq" OWNED BY "public"."bible_verse"."id";



CREATE TABLE IF NOT EXISTS "public"."bible_version" (
    "id" integer NOT NULL,
    "title" character varying(50) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bible_version" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bible_version_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bible_version_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bible_version_id_seq" OWNED BY "public"."bible_version"."id";



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_book" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_book_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_chapter" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_chapter_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_testament" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_testament_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_verse" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_verse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_version" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_version_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bible_book"
    ADD CONSTRAINT "bible_book_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bible_chapter"
    ADD CONSTRAINT "bible_chapter_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bible_testament"
    ADD CONSTRAINT "bible_testament_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bible_verse"
    ADD CONSTRAINT "bible_verse_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bible_version"
    ADD CONSTRAINT "bible_version_pkey" PRIMARY KEY ("id");



CREATE INDEX "bible_book_title_idx" ON "public"."bible_book" USING "btree" ("title");



CREATE INDEX "bible_chapter_chapter_number_idx" ON "public"."bible_chapter" USING "btree" ("chapter_number");



CREATE INDEX "bible_testament_title_idx" ON "public"."bible_testament" USING "btree" ("title");



CREATE INDEX "bible_verse_fts_doc_en_idx" ON "public"."bible_verse" USING "gin" ("fts_doc_en");



CREATE INDEX "bible_version_title_idx" ON "public"."bible_version" USING "btree" ("title");



ALTER TABLE ONLY "public"."bible_book"
    ADD CONSTRAINT "bible_book_bible_testament_id_bible_testament_id_fk" FOREIGN KEY ("bible_testament_id") REFERENCES "public"."bible_testament"("id");



ALTER TABLE ONLY "public"."bible_book"
    ADD CONSTRAINT "bible_book_bible_version_id_bible_version_id_fk" FOREIGN KEY ("bible_version_id") REFERENCES "public"."bible_version"("id");



ALTER TABLE ONLY "public"."bible_chapter"
    ADD CONSTRAINT "bible_chapter_bible_book_id_bible_book_id_fk" FOREIGN KEY ("bible_book_id") REFERENCES "public"."bible_book"("id");



ALTER TABLE ONLY "public"."bible_verse"
    ADD CONSTRAINT "bible_verse_bible_chapter_id_bible_chapter_id_fk" FOREIGN KEY ("bible_chapter_id") REFERENCES "public"."bible_chapter"("id");



CREATE POLICY "Enable read access for all users" ON "public"."bible_book" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."bible_chapter" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."bible_testament" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."bible_verse" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."bible_version" FOR SELECT USING (true);



ALTER TABLE "public"."bible_book" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bible_chapter" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bible_testament" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bible_verse" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bible_version" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextin"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextout"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextrecv"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citextsend"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"(character) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "anon";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"(character) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext"("inet") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "anon";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext"("inet") TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."app_first_load"("version_title" "text", "book_title" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."app_first_load"("version_title" "text", "book_title" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."app_first_load"("version_title" "text", "book_title" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_eq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_hash_extended"("public"."citext", bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_larger"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_ne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_cmp"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_ge"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_gt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_le"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_pattern_lt"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."citext_smaller"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_chapters_by_book_id"("book_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_chapters_by_book_id"("book_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_chapters_by_book_id"("book_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_chapter"("chapter_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_chapter"("chapter_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_chapter"("chapter_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_prev_chapter"("chapter_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_prev_chapter"("chapter_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_prev_chapter"("chapter_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_verses_by_chapter_id"("chapter_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_verses_by_chapter_id"("chapter_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_verses_by_chapter_id"("chapter_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_match"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_matches"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_replace"("public"."citext", "public"."citext", "text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."regexp_split_to_table"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."replace"("public"."citext", "public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_fts"("search_by" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."search_fts"("search_by" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_fts"("search_by" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."split_part"("public"."citext", "public"."citext", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strpos"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticnlike"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexeq"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."texticregexne"("public"."citext", "public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."translate"("public"."citext", "public"."citext", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."max"("public"."citext") TO "service_role";



GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "postgres";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "anon";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "authenticated";
GRANT ALL ON FUNCTION "public"."min"("public"."citext") TO "service_role";





















GRANT ALL ON TABLE "public"."bible_book" TO "anon";
GRANT ALL ON TABLE "public"."bible_book" TO "authenticated";
GRANT ALL ON TABLE "public"."bible_book" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bible_book_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bible_book_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bible_book_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bible_chapter" TO "anon";
GRANT ALL ON TABLE "public"."bible_chapter" TO "authenticated";
GRANT ALL ON TABLE "public"."bible_chapter" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bible_chapter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bible_chapter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bible_chapter_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bible_testament" TO "anon";
GRANT ALL ON TABLE "public"."bible_testament" TO "authenticated";
GRANT ALL ON TABLE "public"."bible_testament" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bible_testament_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bible_testament_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bible_testament_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bible_verse" TO "anon";
GRANT ALL ON TABLE "public"."bible_verse" TO "authenticated";
GRANT ALL ON TABLE "public"."bible_verse" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bible_verse_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bible_verse_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bible_verse_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bible_version" TO "anon";
GRANT ALL ON TABLE "public"."bible_version" TO "authenticated";
GRANT ALL ON TABLE "public"."bible_version" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bible_version_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bible_version_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bible_version_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

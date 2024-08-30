-- Handy if you want to create all tables and seed some data in one go locally


CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";

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



ALTER TABLE ONLY "public"."bible_book" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_book_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_chapter" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_chapter_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_testament" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_testament_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_verse" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_verse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bible_version" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bible_version_id_seq"'::"regclass");



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



--
--
--
--
--
-- 03 add some data

--ADD VERSION 
INSERT INTO public.bible_version(
	title, created_at, updated_at)
	VALUES ('KJV', NOW(), NOW());


--ADD BOOKS
INSERT INTO public.bible_book ("id", "bible_version_id", "title", "created_at", "updated_at") VALUES ('1', '1', 'Genesis', NOW(), NOW()), ('2', '1', 'Exodus', NOW(), NOW());


--ADD CHAPTERS
INSERT INTO "public"."bible_chapter" ("id", "bible_book_id", "chapter_number", "created_at", "updated_at") VALUES ('1', '1', '1', '2024-08-27 22:12:18.316877', '2024-08-27 22:12:18.316877'), ('2', '2', '1', '2024-08-27 22:20:31.765949', '2024-08-27 22:20:31.765949'), ('3', '2', '2', '2024-08-27 22:21:41.763622', '2024-08-27 22:21:41.763622');


--ADD VERSES
INSERT INTO "public"."bible_verse" ("id", "bible_chapter_id", "verse_number", "created_at", "updated_at", "verse_content", "string_length", "full_verse_chapter") VALUES ('1', '1', '1', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'In the beginning God created the heaven and the earth.', '54', '1:1'), ('2', '1', '2', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.', '142', '1:2'), ('3', '1', '3', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let there be light: and there was light.', '54', '1:3'), ('4', '1', '4', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God saw the light, that it was good: and God divided the light from the darkness.', '85', '1:4'), ('5', '1', '5', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.', '115', '1:5'), ('6', '1', '6', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.', '112', '1:6'), ('7', '1', '7', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.', '144', '1:7'), ('8', '1', '8', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God called the firmament Heaven. And the evening and the morning were the second day.', '89', '1:8'), ('9', '1', '9', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.', '126', '1:9'), ('10', '1', '10', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.', '121', '1:10'), ('11', '1', '11', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.', '176', '1:11'), ('12', '1', '12', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.', '174', '1:12'), ('13', '1', '13', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And the evening and the morning were the third day.', '51', '1:13'), ('14', '1', '14', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:', '167', '1:14'), ('15', '1', '15', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.', '102', '1:15'), ('16', '1', '16', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.', '129', '1:16'), ('17', '1', '17', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God set them in the firmament of the heaven to give light upon the earth,', '77', '1:17'), ('18', '1', '18', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.', '117', '1:18'), ('19', '1', '19', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And the evening and the morning were the fourth day.', '52', '1:19'), ('20', '1', '20', '2024-08-27 23:04:42.88582', '2024-08-27 23:04:42.88582', 'And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.', '158', '1:20'), ('21', '2', '1', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Now these are the names of the children of Israel, which came into Egypt; every man and his household came with Jacob.', '118', '1:01'), ('22', '2', '2', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Reuben, Simeon, Levi, and Judah,', '32', '1:02'), ('23', '2', '3', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Issachar, Zebulun, and Benjamin,', '32', '1:03'), ('24', '2', '4', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Dan, and Naphtali, Gad, and Asher.', '34', '1:04'), ('25', '2', '5', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And all the souls that came out of the loins of Jacob were seventy souls: for Joseph was in Egypt already.', '106', '1:05'), ('26', '2', '6', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And Joseph died, and all his brethren, and all that generation.', '63', '1:06'), ('27', '2', '7', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the children of Israel were fruitful, and increased abundantly, and multiplied, and waxed exceeding mighty; and the land was filled with them.', '146', '1:07'), ('28', '2', '8', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Now there arose up a new king over Egypt, which knew not Joseph.', '64', '1:08'), ('29', '2', '9', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And he said unto his people, Behold, the people of the children of Israel are more and mightier than we:', '104', '1:09'), ('30', '2', '10', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Come on, let us deal wisely with them; lest they multiply, and it come to pass, that, when there falleth out any war, they join also unto our enemies, and fight against us, and so get them up out of the land.', '208', '1:10'), ('31', '2', '11', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Therefore they did set over them taskmasters to afflict them with their burdens. And they built for Pharaoh treasure cities, Pithom and Raamses.', '144', '1:11'), ('32', '2', '12', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'But the more they afflicted them, the more they multiplied and grew. And they were grieved because of the children of Israel.', '125', '1:12'), ('33', '2', '13', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the Egyptians made the children of Israel to serve with rigour:', '67', '1:13'), ('34', '2', '14', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And they made their lives bitter with hard bondage, in morter, and in brick, and in all manner of service in the field: all their service, wherein they made them serve, was with rigour.', '185', '1:14'), ('35', '2', '15', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the king of Egypt spake to the Hebrew midwives, of which the name of the one was Shiphrah, and the name of the other Puah:', '126', '1:15'), ('36', '2', '16', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And he said, When ye do the office of a midwife to the Hebrew women, and see them upon the stools; if it be a son, then ye shall kill him: but if it be a daughter, then she shall live.', '184', '1:16'), ('37', '2', '17', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'But the midwives feared God, and did not as the king of Egypt commanded them, but saved the men children alive.', '111', '1:17'), ('38', '2', '18', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the king of Egypt called for the midwives, and said unto them, Why have ye done this thing, and have saved the men children alive?', '134', '1:18'), ('39', '2', '19', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the midwives said unto Pharaoh, Because the Hebrew women are not as the Egyptian women; for they are lively, and are delivered ere the midwives come in unto them.', '166', '1:19'), ('40', '2', '20', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Therefore God dealt well with the midwives: and the people multiplied, and waxed very mighty.', '93', '1:20'), ('41', '2', '21', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And it came to pass, because the midwives feared God, that he made them houses.', '79', '1:21'), ('42', '2', '22', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And Pharaoh charged all his people, saying, Every son that is born ye shall cast into the river, and every daughter ye shall save alive.', '136', '1:22'), ('43', '3', '1', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And there went a man of the house of Levi, and took to wife a daughter of Levi.', '79', '2:01'), ('44', '3', '2', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the woman conceived, and bare a son: and when she saw him that he was a goodly child, she hid him three months.', '115', '2:02'), ('45', '3', '3', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid it in the flags by the river’s brink.', '196', '2:03'), ('46', '3', '4', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And his sister stood afar off, to wit what would be done to him.', '64', '2:04'), ('47', '3', '5', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And the daughter of Pharaoh came down to wash herself at the river; and her maidens walked along by the river’s side; and when she saw the ark among the flags, she sent her maid to fetch it.', '190', '2:05'), ('48', '3', '6', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And when she had opened it, she saw the child: and, behold, the babe wept. And she had compassion on him, and said, This is one of the Hebrews’ children.', '153', '2:06'), ('49', '3', '7', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'Then said his sister to Pharaoh’s daughter, Shall I go and call to thee a nurse of the Hebrew women, that she may nurse the child for thee?', '139', '2:07'), ('50', '3', '8', '2024-08-27 23:06:19.869803', '2024-08-27 23:06:19.869803', 'And Pharaoh’s daughter said to her, Go. And the maid went and called the child’s mother.', '88', '2:08');
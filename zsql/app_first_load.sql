-- created on August 29, 2024
-- intended to supply everything for first load of app/page
-- returns
  -- all book titles
  -- all verses within a book
-- 
-- app_first_load('KJV', 'Genesis')
CREATE OR REPLACE FUNCTION app_first_load(version_title text, book_title text) RETURNS setof json AS $$
DECLARE min_chapter_id integer;

BEGIN -- get first chapter id in table that is in this version (EX: KJV)
SELECT MIN(v.id) INTO min_chapter_id
FROM bible_verse v
  INNER JOIN bible_chapter c ON v.bible_chapter_id = c.id
  INNER JOIN bible_book b ON c.bible_book_id = b.id
  INNER JOIN bible_version bv ON b.bible_version_id = bv.id
WHERE bv.title = version_title;

RETURN QUERY
SELECT json_build_object(
    'book',
    (
      SELECT (row_to_json(q1))
      FROM (
          -- Query here
          SELECT b.id,
            b.title
          from bible_book b
            LEFT JOIN bible_chapter c ON b.id = c.bible_book_id
          WHERE c.id = min_chapter_id
        ) q1
    ),
    'chapter',
    (
      SELECT (row_to_json(q2))
      FROM (
          -- Query here
          SELECT c.id,
            c.chapter_number
          from bible_chapter c
          WHERE c.id = min_chapter_id
        ) q2
    ),
    'books',
    (
      SELECT json_agg(row_to_json(q3))
      FROM (
          -- Your first query here
          SELECT b.id,
            b.title
          from bible_book b
          ORDER BY b.id asc
        ) q3
    ),
    'verses',
    (
      SELECT json_agg(row_to_json(q4))
      FROM (
          -- Your second query here
          select v.id,
            v.verse_content,
            v.full_verse_chapter
          from bible_verse v
          WHERE v.bible_chapter_id = min_chapter_id
          ORDER BY v.id asc
        ) q4
    )
  ) AS combined_results;

END;

$$ LANGUAGE plpgsql;
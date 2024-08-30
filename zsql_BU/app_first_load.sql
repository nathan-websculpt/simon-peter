-- created on August 29, 2024
-- intended to supply everything for first load of app/page
-- returns
  -- all book titles
  -- all verses within a book
-- 
-- app_first_load('KJV', 'Genesis')


CREATE OR REPLACE FUNCTION app_first_load(version_title text, book_title text)
RETURNS setof json 
AS 
$$
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
  'books', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      -- Your first query here
      SELECT b.id, b.title 
      from bible_book b
    ) q1
  ),
  'verses', (
    SELECT json_agg(row_to_json(q2))
    FROM (
      -- Your second query here
      select v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
    WHERE v.bible_chapter_id = min_chapter_id
    ) q2
  )
) AS combined_results;
  
END;
$$ LANGUAGE plpgsql;


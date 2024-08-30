CREATE OR REPLACE FUNCTION get_prev_chapter(chapter_id integer)
RETURNS setof json 
AS 
$$
DECLARE
  prev_chapter_id integer;
  min_chapter_id integer;
BEGIN
  -- get first chapter in table
  SELECT MIN(c.id) INTO min_chapter_id
  FROM bible_chapter c;

-- if user is somehow hitting 'previous' on first page/chapter
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
$$ LANGUAGE plpgsql;
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
    'verses', (
      SELECT json_agg(row_to_json(q1))
      FROM (
        SELECT v.id, v.verse_content, v.full_verse_chapter
        from bible_verse v
        where v.bible_chapter_id = prev_chapter_id
      ) q1
    )
  ) AS combined_results;
  
END;
$$ LANGUAGE plpgsql;
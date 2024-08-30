CREATE OR REPLACE FUNCTION get_next_chapter(chapter_id integer)
RETURNS setof json 
AS 
$$
DECLARE
  next_chapter_id integer;
  max_chapter_id integer;
BEGIN
  -- get last chapter in table
  SELECT MAX(c.id) INTO max_chapter_id
  FROM bible_chapter c;

-- if user somehow hitting 'next' on last page/chapter
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
  'verses', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      SELECT v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
      where v.bible_chapter_id = next_chapter_id
    ) q1
  )
) AS combined_results;
  
END;
$$ LANGUAGE plpgsql;
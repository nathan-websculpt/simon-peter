-- created on August 29, 2024



CREATE OR REPLACE FUNCTION get_verses_by_chapter_id(chapter_id integer)
RETURNS setof json 
AS 
$$
BEGIN

return
query
  SELECT json_build_object(
  'verses', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      SELECT v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
      where v.bible_chapter_id = chapter_id
    ) q1
  )
) AS combined_results;
  
END;
$$ LANGUAGE plpgsql;


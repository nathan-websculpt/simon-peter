-- created on August 29, 2024

CREATE OR REPLACE FUNCTION get_chapters_by_book_id(book_id integer)
RETURNS setof json 
AS 
$$
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
$$ LANGUAGE plpgsql;


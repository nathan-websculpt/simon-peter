-- created on September 9, 2024
CREATE
OR REPLACE FUNCTION search_advanced (search_by varchar) RETURNS setof json AS $$
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
$$ LANGUAGE plpgsql;

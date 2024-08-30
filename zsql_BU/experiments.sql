SELECT json_build_object(
  'query1_results', (
    SELECT json_agg(row_to_json(q1))
    FROM (
      -- first query here
      SELECT b.id, b.title 
      from bible_book b
    ) q1
  ),
  'query2_results', (
    SELECT json_agg(row_to_json(q2))
    FROM (
      -- second query here
      select v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
    WHERE v.bible_chapter_id = 1
    ) q2
  )
) AS combined_results;
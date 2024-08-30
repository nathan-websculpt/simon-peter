 SELECT json_build_object(
  'book', (
    SELECT (row_to_json(q1))
    FROM (
      -- Query here
      SELECT b.id, b.title 
      from bible_book b
      LEFT JOIN bible_chapter c
      ON b.id = c.bible_book_id
    WHERE c.id = 1
    ) q1
  ),
  'chapter', (
    SELECT (row_to_json(q2))
    FROM (
      -- Query here
      SELECT c.id, c.chapter_number
      from bible_chapter c
    WHERE c.id = 1
    ) q2
  ),
  'verses', (
    SELECT json_agg(row_to_json(q3))
    FROM (
      -- Query here
      select v.id, v.verse_content, v.full_verse_chapter
      from bible_verse v
    WHERE v.bible_chapter_id = 1
    ) q3
  )
) AS combined_results;
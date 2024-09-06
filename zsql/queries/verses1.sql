SELECT b.id as book_id,
    b.title as book_title,
    c.chapter_number as chapter_number,
    v.full_verse_chapter,
    v.verse_content,
    v.fts_doc_en
FROM bible_verse v
    JOIN bible_chapter c ON c.id = v.bible_chapter_id
    JOIN bible_book b ON b.id = c.bible_book_id
ORDER BY v.id ASC
limit 100
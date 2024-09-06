--explain analyze
select * from search_fts('and+god')

select * from search_fts('in+the+beginning');


--and
select * from search_fts('firstborn & might');

--or
select * from search_fts('firstborn | might');

--partial
select * from search_fts('in+the+begin:*');

--regular, with partial
select * from search_fts('in+the+beginning' || ':*');


--combined
select * from search_fts('firstborn & might|in+the+beginning');


--proximity
--The proximity symbol is useful for searching for terms that are a certain "distance" apart.
--For example, to find the phrase had eaten, where a match for "had" is followed immediately by a match for "eaten":
select * from search_fts('had <-> eaten');

--We can also use the <-> to find words within a certain distance of each other. 
--For example to find year and been within 3 words of each other
select * from search_fts('year <3> been');

--negation
--find records with 'firstborn' but not 'might'
select * from search_fts('firstborn & !might');






--
--
-- testing
select * from search_fts('in<->the<->beginning');


--plain search
select * from bible_verse where to_tsvector(verse_content) @@ phraseto_tsquery('in the beginning');
--same as above
select * from bible_verse where fts_doc_en @@ phraseto_tsquery('in the beginning');

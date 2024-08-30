-- This is ok for starting on a certain page and reading through the/a whole book
-- This is getting ditched 
-- New viewer will be more-so based on chapters


CREATE OR REPLACE FUNCTION dynamic_page_builder_v_three(max_string_count integer, current_verse_id integer)
RETURNS setof json 
AS 
$$
DECLARE
  max_verse_id integer;
  min_verse_id integer;

  last_verse_of_page_one integer; --need this to prevent user from going past the FIRST verse with 'Previous Page' button

  last_id_of_page integer;
  first_id_of_next_page integer;
  first_id_of_prev_page integer;
  verse_string_length_count integer; --total string.length, to be checked for being less than max_string_count
  current_string_length integer; --string.length of verse
BEGIN
  -- get last verse in table
  SELECT MAX(v.id) INTO max_verse_id
  FROM bible_verse v;

  -- get first verse in table
  SELECT MIN(v.id) INTO min_verse_id   
  FROM bible_verse v;

  -- Initialize variables
  verse_string_length_count := 0; 
  last_id_of_page := current_verse_id;
  last_verse_of_page_one := min_verse_id; -- Immediately gets processed below

  RAISE NOTICE 'max verse id: %', max_verse_id;
  RAISE NOTICE 'min verse id: %', min_verse_id;

  -- Find the last verse ID of Page One
  -- need this to prevent user from going past the FIRST verse with 'Previous Page' button
  WHILE verse_string_length_count <= max_string_count LOOP
    SELECT v.string_length INTO current_string_length
    FROM bible_verse v
    WHERE v.id = last_verse_of_page_one; -- will start off as the min_verse_id (the first verse in table)
  
    verse_string_length_count := verse_string_length_count + current_string_length;
    
    SELECT MIN(v.id) INTO last_verse_of_page_one
    FROM bible_verse v
    WHERE v.id > last_verse_of_page_one; 
  END LOOP;
  
  RAISE NOTICE 'last_verse_of_page_one: %', last_verse_of_page_one;

  -- reset string length counters
  verse_string_length_count := 0;
  current_string_length := 0;

  -- if the user is trying to start page one on like ... verse 5 or 6, then start at verse 1
  IF current_verse_id <= last_verse_of_page_one THEN
    current_verse_id := min_verse_id;
	last_id_of_page := min_verse_id;
  ELSE
    last_verse_of_page_one := 0;
  END IF;
  
  -- Find the last verse ID based on the maximum string length
  WHILE verse_string_length_count <= max_string_count LOOP
    SELECT v.string_length INTO current_string_length
    FROM bible_verse v
    WHERE v.id = last_id_of_page;
    
    verse_string_length_count := verse_string_length_count + current_string_length;
    
    IF last_id_of_page != max_verse_id THEN
      SELECT MIN(v.id) INTO last_id_of_page
      FROM bible_verse v
      WHERE v.id > last_id_of_page;
    END IF;
  END LOOP;


  
  RAISE NOTICE 'Find the last verse ID based on the maximum string length ... last_id_of_page: %', last_id_of_page;


  -- Find the next verse ID
  SELECT MIN(v.id) INTO first_id_of_next_page
  FROM bible_verse v
  WHERE v.id > last_id_of_page;

  RAISE NOTICE 'the next verse id will be first_id_of_next_page: %', first_id_of_next_page;

  -- Find the first verse ID for the previous page
  IF current_verse_id > last_verse_of_page_one THEN
    verse_string_length_count := 0;
    first_id_of_prev_page := current_verse_id; --reset it to the current page, FirstVerseID; work backwords
  RAISE NOTICE 'debugging... first_id_of_prev_page: %', first_id_of_prev_page;
  RAISE NOTICE 'debugging... verse_string_length_count: %', verse_string_length_count;

    WHILE verse_string_length_count <= max_string_count LOOP
      SELECT MAX(v.id) INTO first_id_of_prev_page
      FROM bible_verse v
      WHERE v.id < first_id_of_prev_page;
	  
  RAISE NOTICE 'debugging, loop 1... first_id_of_prev_page: %', first_id_of_prev_page;
      
      SELECT v.string_length INTO current_string_length
      FROM bible_verse v
      WHERE v.id = first_id_of_prev_page;
	  
  RAISE NOTICE 'debugging, loop 2... first_id_of_prev_page: %', first_id_of_prev_page;
      
      verse_string_length_count := verse_string_length_count + current_string_length;
    END LOOP;
  ELSE
    first_id_of_prev_page := min_verse_id;
  END IF;


	
  RAISE NOTICE 'Right before building return, last_id_of_page: %', last_id_of_page;
  RAISE NOTICE 'Right before building return, first_id_of_prev_page: %', first_id_of_prev_page;

  -- Select verses within the range
  RETURN 
  QUERY 
  SELECT json_build_object(
  'first_id_of_prev_page', first_id_of_prev_page,
  'first_id_of_next_page', first_id_of_next_page,
  'verses', json_agg(
    json_build_object(
        'id', v.id, 
        'full_verse_chapter', v.full_verse_chapter, 
        'verse_content', v.verse_content
  ))) from bible_verse v
    WHERE v.id BETWEEN current_verse_id AND last_id_of_page;

  
END;
$$ LANGUAGE plpgsql;


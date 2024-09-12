--explain analyze
-- returns 102
select * from search_advanced('seen & lord | noah');

-- returns 101
select * from search_advanced('fifteenth | ninth | eighth | nineteenth | eighteenth | rameses');
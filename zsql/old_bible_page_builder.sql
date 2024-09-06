-- This is old t-sql getting converted to postgresql
USE [Publisher_Prod_June_2024]
GO
	/****** Object:  StoredProcedure [dbo].[DynamicPageBuilder_V_TWO]    Script Date: 8/28/2024 6:55:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO -- =============================================
	-- Author:		Nathan C.
	-- Create date: 1/25/2020
	-- Description:	Re-tooling the way bible pages render
	--					I want to PRG the whole thing,
	--					So a page (list of verses) also need the prev/next's
	--						FirstVerseID ... 
	-- =============================================
	ALTER PROCEDURE [dbo].[DynamicPageBuilder_V_TWO] @MaxStringCount int,
	@CurrentVerseID int AS BEGIN
SET NOCOUNT ON;

DECLARE @lastlastID int;

DECLARE @verseStringLengthCount int;

--total string.length, to be checked for being less than @MaxStringCount
DECLARE @currentStringLength int;

--string.length of verse
SET @verseStringLengthCount = 0;

SET @lastlastID = @CurrentVerseID;

WHILE @verseStringLengthCount <= @MaxStringCount BEGIN
SELECT TOP 1 @currentStringLength = v.StringLength
FROM BibleVerses v
WHERE v.VerseID = @lastlastID
SET @verseStringLengthCount = @verseStringLengthCount + @currentStringLength;

IF(@lastlastID != 31102) --HACK; 31102 IS THE LAST VERSE
SET @lastlastID = (
		SELECT TOP 1 MIN(VerseID)
		FROM BibleVerses v
		WHERE VerseID > @lastlastID
	);

END
SELECT *
FROM BibleVerses
WHERE VerseID BETWEEN @CurrentVerseID AND (@lastlastID) --now get the next id
	(
		SELECT TOP 1 MIN(VerseID)
		FROM BibleVerses v
		WHERE VerseID > @lastlastID
	) --now get the first id for the previous page
	IF(@CurrentVerseID > 77) --HACK
	BEGIN
SET @verseStringLengthCount = 0;

SET @currentStringLength = 0;

SET @lastlastID = @CurrentVerseID;

--reset it to the current page, FirstVerseID; work backwords
WHILE @verseStringLengthCount <= @MaxStringCount BEGIN
SET @lastlastID = (
		SELECT TOP 1 MAX(VerseID)
		FROM BibleVerses v
		WHERE VerseID < @lastlastID
	);

SELECT TOP 1 @currentStringLength = v.StringLength
FROM BibleVerses v
WHERE v.VerseID = @lastlastID
SET @verseStringLengthCount = @verseStringLengthCount + @currentStringLength;

END
SELECT @lastlastID
END
END
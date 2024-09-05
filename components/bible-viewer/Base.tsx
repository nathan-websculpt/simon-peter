"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "../helpers/LoadingSpinner";
import { createClient } from "@/utils/supabase/client";
import { PrevNextButtons } from "./PrevNextButtons";
import { Verses } from "./Verses";
import { BookDetails } from "./BookDetails";
import { ViewBooks } from "./ViewBooks";
import { ViewChapters } from "./ViewChapters";
import { VersesSearched } from "./VersesSearched";
import { Search } from "./Search";
import { BaseButtons } from "./BaseButtons";

export const Base = () => {
  const supabase = createClient();
  const [isInViewBooksMode, setIsInViewBooksMode] = useState(false);
  const [isInViewChaptersMode, setIsInViewChaptersMode] = useState(false);

  const [theVerses, setTheVerses]: any = useState(null);
  const [chapters, setChapters]: any = useState(null);
  const [theBooks, setTheBooks]: any = useState(null);

  const [currentBookTitle, setCurrentBookTitle] = useState("");
  const [currentChapterTitle, setCurrentChapterTitle] = useState("");
  const [currentChapterId, setCurrentChapterId] = useState(1);

  const [userSearchInput, setUserSearchInput] = useState("");
  const [versesSearched, setVersesSearched]: any = useState(null); //when user searches -- holds list of verses separate
  const [isUserSearching, setIsUserSearching] = useState(false);

  const [showSearchingSpinner, setShowSearchingSpinner] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      console.log("initializing");

      const queryParams: object = {
        version_title: "KJV",
        book_title: "Genesis",
      };
      const initData = await handleRPC("app_first_load", queryParams);

      setTheVerses(initData.verses);
      setTheBooks(initData.books);
      setCurrentBookTitle(initData.book.title);
      setCurrentChapterTitle(initData.chapter.chapter_number);
    };

    initialFetch();
  }, []); //remember, this is componentDidMount

  //todo: remove this
  useEffect(() => {
    if (isUserSearching) {
      console.log("user searching...", versesSearched);
    }
  }, [versesSearched, isUserSearching]);

  useEffect(() => {
    if (chapters) {
      setIsInViewChaptersMode(!isInViewChaptersMode);
    }
  }, [chapters]);

  const handleToggle = () => {
    setIsInViewBooksMode(!isInViewBooksMode);
    setIsInViewChaptersMode(false); //either way, chapter list should be hidden
  };

  const handleRPC = async (
    funtionToCall: string,
    queryParams: object
  ): object => {
    const { data, error } = await supabase.rpc(funtionToCall, queryParams);

    if (error) {
      console.error("Error calling stored procedure:", error);
      return null;
    }
    console.log("data from", funtionToCall, " was:", data[0]);

    return data[0];
  };

  const handleChangeBook = async (e) => {
    const bookId = e.target.getAttribute("data-bookid");
    const queryParams: object = {
      book_id: Number(bookId),
    };
    const data = await handleRPC("get_chapters_by_book_id", queryParams);
    setChapters(data);
  };

  const handleChangeChapter = async (e) => {
    const chapterId = e.target.getAttribute("data-chapterid");
    const queryParams: object = {
      chapter_id: Number(chapterId),
    };
    const data = await handleRPC("get_verses_by_chapter_id", queryParams);

    setTheVerses(data.verses);

    setIsInViewChaptersMode(false);
    setIsInViewBooksMode(false);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  const handlePrevPageClick = async (e) => {
    const queryParams: object = {
      chapter_id: Number(currentChapterId),
    };
    const data = await handleRPC("get_prev_chapter", queryParams);
    console.log("PREV CLICK: This Chapter's Verses:", data);

    setTheVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  const handleNextPageClick = async (e) => {
    const queryParams: object = {
      chapter_id: currentChapterId,
    };
    const data = await handleRPC("get_next_chapter", queryParams);
    console.log("NEXT CLICK: This Chapter's Verses:", data);

    setTheVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  const handleSearch = async () => {
    setVersesSearched(null);
    setShowSearchingSpinner(true);
    setIsUserSearching(true); //this is correct in-that it is not a part of the IF statement
    //process string before searching
    let newSearchString = userSearchInput.replace(/  +/g, " ").trim(); //turn all spaces into one space
    console.log("multiple spaces turned into one:", newSearchString);
    newSearchString = newSearchString.replace(/ /g, "+");
    console.log("spaces replaced with +:", newSearchString);

    const queryParams: object = {
      search_by: newSearchString,
    };
    const data = await handleRPC("search_fts", queryParams);
    if (data) setVersesSearched(data.verses);
    setShowSearchingSpinner(false);
  };
  const clearSearch = async () => {
    setVersesSearched(null);
    setIsUserSearching(false);
    setUserSearchInput("");
  };

  const backButtonOnChapters = async () => {
    setIsInViewChaptersMode(false);
  };

  return (
    <>
      {!theVerses || theVerses.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              {!isUserSearching && (
                <BaseButtons
                  isInViewChaptersMode={isInViewChaptersMode}
                  isInViewBooksMode={isInViewBooksMode}
                  handleToggle={handleToggle}
                  backButtonOnChapters={backButtonOnChapters}
                />
              )}

              {/* only show search bar if not viewing books/chapters */}
              {!isInViewBooksMode && !isInViewChaptersMode && (
                // the search bar
                <Search
                  userSearchInput={userSearchInput}
                  handleSearch={handleSearch}
                  clearSearch={clearSearch}
                  setUserSearchInput={setUserSearchInput}
                />
              )}
            </div>

            {isUserSearching ? (
              // user is searching
              <VersesSearched
                verses={versesSearched}
                showSearchingSpinner={showSearchingSpinner}
              />
            ) : (
              //user is not searching
              <>
                {isInViewBooksMode ? (
                  <>
                    {/* book-selections will show/hide chapters */}
                    {isInViewChaptersMode ? (
                      <ViewChapters
                        chapters={chapters?.chapters}
                        handleChangeChapter={handleChangeChapter}
                      />
                    ) : (
                      <ViewBooks
                        books={theBooks}
                        handleChangeBook={handleChangeBook}
                      />
                    )}
                  </>
                ) : (
                  //prev-next buttons, book-chapter details, and verses
                  <div className="flex flex-col gap-1 mb-12 lg:px-12 xl:w-full mx-auto prose prose-xl">
                    <PrevNextButtons
                      handlePrevPageClick={handlePrevPageClick}
                      handleNextPageClick={handleNextPageClick}
                    />

                    <BookDetails
                      currentBookTitle={currentBookTitle}
                      currentChapterTitle={currentChapterTitle}
                    />

                    <Verses verses={theVerses} />

                    <PrevNextButtons
                      handlePrevPageClick={handlePrevPageClick}
                      handleNextPageClick={handleNextPageClick}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

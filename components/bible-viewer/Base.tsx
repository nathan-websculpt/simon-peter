"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "../helpers/LoadingSpinner";
import { PrevNextButtons } from "./PrevNextButtons";
import { Verses } from "./Verses";
import { BookDetails } from "./BookDetails";
import { ViewBooks } from "./ViewBooks";
import { ViewChapters } from "./ViewChapters";
import { VersesSearched } from "./VersesSearched";
import { Search } from "./Search";
import { BaseButtons } from "./BaseButtons";
import { handleRPC } from "@/utils/handleRPC";

export const Base = () => {
  const [isInViewBooksMode, setIsInViewBooksMode] = useState(false);
  const [isInViewChaptersMode, setIsInViewChaptersMode] = useState(false);

  const [verses, setVerses]: any = useState(null);
  const [chapters, setChapters]: any = useState(null);
  const [books, setBooks]: any = useState(null);

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

      setVerses(initData.verses);
      setBooks(initData.books);
      setCurrentBookTitle(initData.book.title);
      setCurrentChapterTitle(initData.chapter.chapter_number);
    };

    initialFetch();
  }, []); //remember, this is componentDidMount

  useEffect(() => {
    if (chapters) {
      setIsInViewChaptersMode(!isInViewChaptersMode);
    }
  }, [chapters]);

  return (
    <>
      {!verses || verses.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              {!isUserSearching && (
                <BaseButtons
                  isInViewChaptersMode={isInViewChaptersMode}
                  isInViewBooksMode={isInViewBooksMode}
                  setIsInViewBooksMode={setIsInViewBooksMode}
                  setIsInViewChaptersMode={setIsInViewChaptersMode}
                />
              )}

              {/* only show search bar if not viewing books/chapters */}
              {!isInViewBooksMode && !isInViewChaptersMode && (
                // the search bar
                <Search
                  userSearchInput={userSearchInput}
                  setUserSearchInput={setUserSearchInput}
                  setVersesSearched={setVersesSearched}
                  setIsUserSearching={setIsUserSearching}
                  setShowSearchingSpinner={setShowSearchingSpinner}
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
                        setVerses={setVerses}
                        setIsInViewChaptersMode={setIsInViewChaptersMode}
                        setIsInViewBooksMode={setIsInViewBooksMode}
                        setCurrentBookTitle={setCurrentBookTitle}
                        setCurrentChapterTitle={setCurrentChapterTitle}
                        setCurrentChapterId={setCurrentChapterId}
                        chapters={chapters?.chapters}
                      />
                    ) : (
                      <ViewBooks books={books} setChapters={setChapters} />
                    )}
                  </>
                ) : (
                  //prev-next buttons, book-chapter details, and verses
                  <div className="flex flex-col gap-1 mb-12 lg:px-12 xl:w-full mx-auto prose prose-xl">
                    <PrevNextButtons
                      currentChapterId={currentChapterId}
                      setCurrentBookTitle={setCurrentBookTitle}
                      setCurrentChapterTitle={setCurrentChapterTitle}
                      setCurrentChapterId={setCurrentChapterId}
                      setVerses={setVerses}
                    />

                    <BookDetails
                      currentBookTitle={currentBookTitle}
                      currentChapterTitle={currentChapterTitle}
                    />

                    <Verses verses={verses} />

                    <PrevNextButtons
                      currentChapterId={currentChapterId}
                      setCurrentBookTitle={setCurrentBookTitle}
                      setCurrentChapterTitle={setCurrentChapterTitle}
                      setCurrentChapterId={setCurrentChapterId}
                      setVerses={setVerses}
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

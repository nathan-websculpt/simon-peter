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
import { BaseMenu } from "./BaseMenu";
import { cn } from "@/lib/utils";

export const Base = () => {
  console.log("Base component rendered", Date.now());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInViewBooksMode, setIsInViewBooksMode] = useState(false);
  const [isInViewChaptersMode, setIsInViewChaptersMode] = useState(false);

  //TODO: look for null-breaks and checks before moving away from ':any' here
  const [verses, setVerses]: any = useState(null);
  const [chapters, setChapters]: any = useState(null);
  const [books, setBooks]: any = useState(null);

  const [currentBookTitle, setCurrentBookTitle] = useState("");
  const [currentChapterTitle, setCurrentChapterTitle] = useState("");
  const [currentChapterId, setCurrentChapterId] = useState(1);

  const [isInSearchMode, setIsInSearchMode] = useState(false); // a search type/mode has been selected
  const [isUserSearching, setIsUserSearching] = useState(false); // actively searching
  const [userSearchInput, setUserSearchInput] = useState("");
  const [userSearchInputProcessed, setUserSearchInputProcessed] = useState(""); //after it is cleaned/processed; change of this gens books-filter
  const [versesSearched, setVersesSearched]: any = useState(null); //when user searches -- holds list of verses separated
  const [versesSearchedCopy, setVersesSearchedCopy]: any = useState(null); //use to filter the nth time, so all verses can be included in the filer

  const [showSearchingSpinner, setShowSearchingSpinner] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<string>("");

  useEffect(() => {
    console.log("base component mounted", Date.now());
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, []); //componentDidMount

  useEffect(() => {
    const initialFetch = async () => {
      const queryParams: object = {
        version_title: "KJV",
        book_title: "Genesis",
      };
      const initData: any = await handleRPC("app_first_load", queryParams);

      setVerses(initData.verses);
      setBooks(initData.books);
      setCurrentBookTitle(initData.book.title);
      setCurrentChapterTitle(initData.chapter.chapter_number);
    };

    if (isInitialized) initialFetch();
  }, [isInitialized]);

  useEffect(() => {
    if (chapters) {
      setIsInViewChaptersMode(!isInViewChaptersMode);
    }
  }, [chapters]);

  return (
    <>
      <div
        className={cn("flex flex-row w-full md:w-4/5 xl:w-3/5 mt-2 md:mt-6", {
          "justify-between": !(
            isInViewBooksMode ||
            isInViewChaptersMode ||
            isMenuOpen
          ),
          "justify-end":
            isMenuOpen && !(isInViewBooksMode || isInViewChaptersMode),
        })}
      >
        <BaseButtons
          isInViewChaptersMode={isInViewChaptersMode}
          isInViewBooksMode={isInViewBooksMode}
          setIsInViewBooksMode={setIsInViewBooksMode}
          setIsInViewChaptersMode={setIsInViewChaptersMode}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setIsUserSearching={setIsUserSearching}
          setIsInSearchMode={setIsInSearchMode}
          isInSearchMode={isInSearchMode}
        />
      </div>
      {isMenuOpen ? (
        <>
          <BaseMenu
            setIsMenuOpen={setIsMenuOpen}
            setSearchType={setSearchType}
            setIsInSearchMode={setIsInSearchMode}
            setVersesSearched={setVersesSearched}
            setVersesSearchedCopy={setVersesSearchedCopy}
            setIsUserSearching={setIsUserSearching}
            setUserSearchInput={setUserSearchInput}
          />
        </>
      ) : (
        <>
          {!verses || verses.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* only show search bar if not viewing books/chapters && in search mode */}
              {!isInViewBooksMode &&
                !isInViewChaptersMode &&
                isInSearchMode && (
                  // the search bar
                  <Search
                    userSearchInput={userSearchInput}
                    setUserSearchInput={setUserSearchInput}
                    setVersesSearched={setVersesSearched}
                    setVersesSearchedCopy={setVersesSearchedCopy}
                    setIsUserSearching={setIsUserSearching}
                    setShowSearchingSpinner={setShowSearchingSpinner}
                    searchType={searchType}
                    setUserSearchInputProcessed={setUserSearchInputProcessed}
                  />
                )}

              {isInSearchMode || isUserSearching ? (
                <>
                  <h1 className="prose prose-lg">
                    you are in {searchType} search mode
                  </h1>
                  {isUserSearching && (
                    <VersesSearched
                      verses={versesSearched}
                      showSearchingSpinner={showSearchingSpinner}
                      setVersesSearched={setVersesSearched}
                      versesSearchedCopy={versesSearchedCopy}
                      userSearchInputProcessed={userSearchInputProcessed}
                    />
                  )}
                </>
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
                          chapters={chapters}
                        />
                      ) : (
                        <ViewBooks books={books} setChapters={setChapters} />
                      )}
                    </>
                  ) : (
                    //prev-next buttons, book-chapter details, and verses
                    <div className="flex flex-col gap-1 mb-4 lg:px-12 xl:w-full mx-auto prose prose-xl">
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
            </>
          )}
        </>
      )}
    </>
  );
};

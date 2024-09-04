"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  BackwardIcon,
  MagnifyingGlassCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner } from "../helpers/LoadingSpinner";
import { createClient } from "@/utils/supabase/client";

export const First = () => {
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
                <>
                  <div className="flex flex-row">
                    {isInViewChaptersMode && (
                      <>
                        <div className="flex flex-col">
                          <button
                            className="btn-circle btn btn-primary"
                            onClick={backButtonOnChapters}
                          >
                            <ArrowLeftIcon className="w-6 h-6" />
                          </button>
                        </div>
                      </>
                    )}

                    {/* the book-view / verses-view toggle button */}
                    <div className="flex flex-col">
                      <div className="flex flex-row pl-4">
                        <label className="btn btn-circle btn-primary swap swap-rotate">
                          {/* this hidden checkbox controls the state */}
                          <input
                            className="focus:outline-none"
                            type="checkbox"
                            onChange={handleToggle}
                            checked={isInViewBooksMode}
                            aria-label="Change View Mode"
                          />

                          {/* icons from: https://heroicons.com/solid */}
                          {/* LIST icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 swap-on"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
                              clipRule="evenodd"
                            />
                          </svg>

                          {/* BOOK icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 swap-off"
                          >
                            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* only show search bar if not viewing books/chapters */}
              {!isInViewBooksMode && !isInViewChaptersMode && (
                // the search bar
                <div className="flex flex-row justify-center w-full gap-1 px-4 mx-auto mb-12 lg:w-11/12 xl:w-3/4 xl:px-0">
                  <div className="flex flex-row w-11/12 xl:w-3/4">
                    <input
                      className="w-full h-12 pl-4 focus:outline-none bg-base-100"
                      placeholder="Search by text"
                      value={userSearchInput}
                      onChange={(e) => setUserSearchInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? handleSearch() : null
                      }
                      aria-labelledby="Search by text"
                    ></input>
                    <button
                      className="px-4 rounded-none md:px-6 btn btn-primary"
                      onClick={() => handleSearch()}
                      aria-labelledby="Search Button"
                    >
                      <MagnifyingGlassCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <button
                    className="px-2 ml-2 rounded-none md:px-10 btn btn-primary"
                    onClick={() => clearSearch()}
                    aria-labelledby="Clear Search Button"
                  >
                    <XCircleIcon className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>

            {isUserSearching ? (
              // user is searching
              <>
                <div className="flex flex-col items-center justify-center gap-1 mb-12 lg:justify-between lg:px-12 w-screen xl:w-4/5 mx-auto prose prose-xl">
                  <div className="pt-10 pb-8 pl-4 pr-3 sm:mx-auto sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
                    {showSearchingSpinner ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        {versesSearched?.length === 0 ||
                          (!versesSearched && (
                            <div className="text-center">
                              <h1 className="font-bold">No Results Found</h1>
                              <p>
                                Searches need to be somewhat specific, for
                                example:
                              </p>
                              <ul className="text-left">
                                <li>
                                  <p>
                                    These searches will be based on text within
                                    the verses
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    A search for <strong>"John 1:1"</strong>{" "}
                                    will not return anything, but a search for{" "}
                                    <strong>"in the beginning"</strong> will
                                    return <strong>John 1:1</strong> (and
                                    others)
                                  </p>
                                </li>
                                <li>
                                  <p>
                                    Searching for <strong>"in the"</strong> will
                                    not return anything, but a search for{" "}
                                    <strong>"in the beginning"</strong> will
                                  </p>
                                </li>
                              </ul>
                            </div>
                          ))}
                      </>
                    )}

                    {versesSearched?.map((verse) => (
                      <div
                        key={verse.id.toString()}
                        className="bg-base-200 my-6 px-4 py-2 flex flex-col"
                      >
                        <p className="px-2">{verse.verse_content}</p>
                        <h5 className="text-right px-4">
                          {verse.book_title} {verse.full_verse_chapter}
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              //user is not searching
              <>
                {isInViewBooksMode ? (
                  <>
                    {/* book-selections will show/hide chapters */}
                    {isInViewChaptersMode ? (
                      <>
                        <div className="grid grid-cols-4 gap-4 xl:grid-cols-10 mt-12 xl:mt-24 mb-12">
                          {chapters?.chapters?.map((chapter) => (
                            <button
                              className="btn btn-primary"
                              key={chapter.id}
                              onClick={handleChangeChapter}
                              data-chapterid={chapter.id}
                            >
                              {chapter.chapter_number}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* buttons to see chapters in a certain book */}
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mt-12 xl:mt-24 mb-12">
                          {theBooks?.map((book) => (
                            <button
                              className="btn btn-primary"
                              key={book.id}
                              onClick={handleChangeBook}
                              data-bookid={book.id}
                            >
                              {book.title}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  //verses
                  <div className="flex flex-col gap-1 mb-12 lg:px-12 xl:w-full mx-auto prose prose-xl">
                    {/* way to change chapter */}
                    <div className="flex flex-row justify-around xl:justify-between w-screen xl:w-4/5 mx-auto mt-4 mb-8">
                      <button
                        className="btn btn-primary"
                        onClick={handlePrevPageClick}
                      >
                        PREV
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={handleNextPageClick}
                      >
                        NEXT
                      </button>
                    </div>
                    <div className="text-center">
                      <h1>{currentBookTitle}</h1>
                      <h2>Chapter {currentChapterTitle}</h2>
                    </div>
                    <div className="pt-10 pb-8 pl-4 pr-3 mx-auto sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
                      {theVerses?.map((verse) => (
                        <span
                          key={verse.id.toString()}
                          className="pl-2 align-text-bottom"
                        >
                          {verse.full_verse_chapter}
                          <span className="pl-2 align-text-top">
                            {verse.verse_content}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-row justify-around xl:justify-between w-screen xl:w-4/5 mx-auto">
                      <button
                        className="btn btn-primary"
                        onClick={handlePrevPageClick}
                      >
                        PREV
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={handleNextPageClick}
                      >
                        NEXT
                      </button>
                    </div>
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

"use client";

import { useEffect, useState } from "react";

export const First = ({
  initApp,
  updateChapters,
  updateVerses,
  getPreviousChapter,
  getNextChapter,
}: any) => {
  const [isInViewBooksMode, setIsInViewBooksMode] = useState(false);
  const [isInViewChaptersMode, setIsInViewChaptersMode] = useState(false);

  const [theVerses, setTheVerses]: any = useState(null);
  const [chapters, setChapters]: any = useState(null);
  const [theBooks, setTheBooks]: any = useState(null);

  //TODO: get from db on init - for when other versions are present in db
  const [currentBookTitle, setCurrentBookTitle] = useState("");
  const [currentChapterTitle, setCurrentChapterTitle] = useState("");
  const [currentChapterId, setCurrentChapterId] = useState(1);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  const init = async () => {
    console.log("initializing...");
    setHasInitialized(true);
    const initData = await initApp(); // contains book/chapter info and that chapter's verses
    setTheVerses(initData.verses);
    setTheBooks(initData.books);
    setCurrentBookTitle(initData.book.title);
    setCurrentChapterTitle(initData.chapter.chapter_number);
  };

  useEffect(() => {
    if (chapters) {
      setIsInViewChaptersMode(!isInViewChaptersMode);
      console.log("chapters list:", chapters);
    }
  }, [chapters]);

  useEffect(() => {
    if (theVerses) {
      console.log("verses should be swapped out to... :", theVerses);
    }
  }, [theVerses]);

  const handleToggle = () => {
    setIsInViewBooksMode(!isInViewBooksMode);
  };

  const handleChangeBook = async (e) => {
    const bookId = e.target.getAttribute("data-bookid");
    console.log("bookId:", bookId);

    const thisBooksChapters = await updateChapters(bookId);
    setChapters(thisBooksChapters);

    // set the current book title - using only obj on client
    setCurrentBookTitle(theBooks.find((book) => book.id === bookId)?.title);
  };

  const handleChangeChapter = async (e) => {
    const chapterId = e.target.getAttribute("data-chapterid");
    console.log("chapterId:", chapterId);

    const this_obj = await updateVerses(chapterId);
    //setChapters(thisBooksChapters); //TODO: set verses...

    // thisPageInitData.verses = thisChaptersVerses;
    console.log("This Chapter's Verses:", this_obj);
    setTheVerses(this_obj.verses);

    setIsInViewChaptersMode(false);
    setIsInViewBooksMode(false);

    setCurrentBookTitle(this_obj.book.title);
    setCurrentChapterId(this_obj.chapter.id);
    setCurrentChapterTitle(this_obj.chapter.chapter_number.toString());
  };

  if (hasStarted && !hasInitialized) init();

  const handlePrevPageClick = async (e) => {
    const this_obj = await getPreviousChapter(currentChapterId);
    console.log("PREV CLICK: This Chapter's Verses:", this_obj);

    setTheVerses(this_obj.verses);

    setCurrentBookTitle(this_obj.book.title);
    setCurrentChapterId(this_obj.chapter.id);
    setCurrentChapterTitle(this_obj.chapter.chapter_number.toString());
  };

  const handleNextPageClick = async (e) => {
    const this_obj = await getNextChapter(currentChapterId);
    console.log("NEXT CLICK: This Chapter's Verses:", this_obj);

    setTheVerses(this_obj.verses);

    setCurrentBookTitle(this_obj.book.title);
    setCurrentChapterId(this_obj.chapter.id);
    setCurrentChapterTitle(this_obj.chapter.chapter_number.toString());
  };

  return (
    <>
      {/* todo: this may be a daisyui thing... */}
      {/* button to alter state */}
      <div className="flex flex-col w-full">
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

        {isInViewBooksMode ? (
          <>
            {/* button to show/hide chapters */}
            {isInViewChaptersMode ? (
              <>
                <div className="flex flex-col xl:w-4/5 mx-3 mt-32 gap-4 mx-3 mt-32">
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
                {/* button to show/hide books */}
                <div className="flex flex-col xl:w-4/5 mx-3 mt-32 gap-4">
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
          <div className="flex flex-col items-center justify-center gap-1 mb-12 lg:justify-between lg:px-12 w-screen xl:w-4/5 mx-auto prose-xl">
            {/* way to change chapter */}
            <div className="flex flex-row justify-around xl:justify-between w-screen xl:w-4/5 mx-auto mt-4 mb-8">
              <button className="btn btn-primary" onClick={handlePrevPageClick}>
                PREV
              </button>

              <button className="btn btn-primary" onClick={handleNextPageClick}>
                NEXT
              </button>
            </div>
            <div className="text-center">
              <h1 className="prose">{currentBookTitle}</h1>
              <h2 className="prose">Chapter {currentChapterTitle}</h2>
            </div>
            <div className="pt-10 pb-8 pl-4 pr-3 mt-6 shadow-xl bg-primary sm:mx-auto sm:rounded-lg sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
              {theVerses?.map((verse) => (
                <span
                  key={verse.id.toString()}
                  className="pl-2 text-sm align-text-bottom text-black text-opacity-75 typeo"
                >
                  {verse.full_verse_chapter}
                  <span className="pl-2 text-lg align-text-top text-opacity-90">
                    {verse.verse_content}
                  </span>
                </span>
              ))}
            </div>
            <div className="flex flex-row  justify-around xl:justify-between w-screen xl:w-4/5 mx-auto">
              <button className="btn btn-primary" onClick={handlePrevPageClick}>
                PREV
              </button>

              <button className="btn btn-primary" onClick={handleNextPageClick}>
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

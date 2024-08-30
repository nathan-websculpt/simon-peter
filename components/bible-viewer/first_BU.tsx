"use client";

import { useEffect, useState } from "react";

export const First = ({ initApp, updateChapters, updateVerses }: any) => {
  const [viewStyleDisplayString, setViewStyleDisplayString] =
    useState("INIT View"); //todo: won't need
  const [isInViewBooksMode, setIsInViewBooksMode] = useState(false);
  const [isInViewChaptersMode, setIsInViewChaptersMode] = useState(false);

  const [theVerses, setTheVerses]: any = useState(null);

  const [chapters, setChapters]: any = useState(null);

  const [theBooks, setTheBooks]: any = useState(null);

  const [hasInitialized, setHasInitialized] = useState(false);

  const init = async () => {
    console.log("initializing...");
    setHasInitialized(true);
    const halp = await initApp();
    setTheVerses(halp.verses);
    setTheBooks(halp.books);
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
  };

  const handleChangeChapter = async (e) => {
    const chapterId = e.target.getAttribute("data-chapterid");
    console.log("chapterId:", chapterId);

    const thisChaptersVerses = await updateVerses(chapterId);
    //setChapters(thisBooksChapters); //TODO: set verses...

    // thisPageInitData.verses = thisChaptersVerses;
    console.log("This Chapter's Verses:", thisChaptersVerses);
    setTheVerses(thisChaptersVerses.verses);

    setIsInViewChaptersMode(false);
    setIsInViewBooksMode(false);

    // TODO: how to change this const that is showing verses?
    // because it can't be a useState if it is in the server component
  };

  if (!hasInitialized) init();

  return (
    <>
      {/* todo: this may be a daisyui thing... */}
      {/* button to alter state */}
      <div className="flex flex-col">
        <div className="flex flex-row gap-4 place-items-center">
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
          <p className="text-sm font-bold sm:text-md lg:text-xl">
            {viewStyleDisplayString}
          </p>
        </div>
      </div>

      {isInViewBooksMode ? (
        // button to show/hide books
        <>
          {isInViewChaptersMode ? (
            <>
              <div>in chapters</div>
              <div className="flex flex-col w-4/5 mx-3 mt-32">
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
              <div>NOT in chapters</div>

              <div className="flex flex-col w-4/5 mx-3 mt-32">
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
        <div className="flex flex-col items-center justify-center gap-1 mb-12 lg:justify-between lg:flex-row lg:px-12 w-4/5">
          <div className="pt-10 pb-8 pl-4 pr-3 mt-6 shadow-xl bg-primary sm:mx-auto sm:rounded-lg sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
            {theVerses?.map((verse) => (
              <span
                key={verse.id.toString()}
                className="pl-2 text-sm align-text-bottom"
              >
                {verse.full_verse_chapter}
                <span className="pl-2 text-lg align-text-top">
                  {verse.verse_content}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* way to change chapter */}
      <div></div>
    </>
  );
};

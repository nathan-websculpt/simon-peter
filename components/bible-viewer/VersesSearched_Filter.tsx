//to filter local data (verses already searched) by book title

import { toast } from "@/lib/utils";
import { FilterIcon } from "lucide-react";
import { Dispatch, useEffect, useState } from "react";

interface FilterProps {
  verses: [];
  isOnFilterPage: boolean;
  setIsOnFilterPage: Dispatch<boolean>;
  setVerses: Dispatch<[]>;
  userSearchInputProcessed: string;
  versesSearchedCopy: [];
  setVersesSearchedFiltered: Dispatch<[]>;
  pageNum: number;
  setPageNum: Dispatch<number>;
  pageSize: number;
}

export const Filter = ({
  verses,
  isOnFilterPage,
  setIsOnFilterPage,
  setVerses,
  userSearchInputProcessed,
  versesSearchedCopy,
  setVersesSearchedFiltered,
  pageNum,
  setPageNum,
  pageSize,
}: FilterProps) => {
  const [bookList, setBookList] = useState([]);
  const [filteredBookList, setFilteredBookList] = useState([]);
  const [filteredBookListCopy, setFilteredBookListCopy] = useState([]); //if the user filters out the last book, filteredBookList will be rest to filteredBookListCopy
  const [resettingFilteredBookList, setResettingFilteredBookList] =
    useState(false);

  const [hasUserFilteredThisSearchYet, setHasUserFilteredThisSearchYet] =
    useState(false);

  const [allBooksSelected, setAllBooksSelected] = useState(true); //this is select/de-select all books (on filter page)

  useEffect(() => {
    console.log("Filter component rendered", Date.now());
  }, []);

  useEffect(() => {
    console.log(
      "userSearchInputProcessed: ",
      userSearchInputProcessed,
      "... processing books-filter list..."
    );
    setHasUserFilteredThisSearchYet(false); //this will keep us from needing to use two copies of verses UNTIL the user filters
    processBooks();
  }, [userSearchInputProcessed]); //this will only change once user has established a new search

  useEffect(() => {
    console.log("verses changing to: ", verses);
  }, [verses]);

  useEffect(() => {
    if (!isOnFilterPage && hasUserFilteredThisSearchYet) {
      handleBookFilter();
    }
  }, [isOnFilterPage]);

  useEffect(() => {
    if (resettingFilteredBookList) {
      setResettingFilteredBookList(false);
      return;
    }

    if (
      filteredBookList &&
      bookList &&
      filteredBookList.length > 0 &&
      filteredBookList.length === bookList.length &&
      filteredBookList.every((value) => bookList.includes(value))
    ) {
      console.log("USER IS FILTERING OUT THE FINAL BOOK");
      toast({
        message:
          "You can't filter out all of the books. Must leave at least one.",
        success: false,
      });
      setResettingFilteredBookList(true);
      setFilteredBookList(filteredBookListCopy); //reset to the previous state

      //reset the checkbox that got us here
      const checkbox = document.querySelector<HTMLInputElement>(
        `input[id="${filteredBookList[filteredBookList.length - 1]}"]`
      );
      console.log("checkbox: ", checkbox);
      if (checkbox) checkbox.checked = true;

      return;
    }

    if (!hasUserFilteredThisSearchYet) setHasUserFilteredThisSearchYet(true);

    setFilteredBookListCopy(filteredBookList);

    if (filteredBookList && filteredBookList.length > 0)
      console.log("filteredBookList: ", filteredBookList);
  }, [filteredBookList]);

  const processBooks = async () => {
    const uniqueBookTitles: any = Array.from(
      new Set(versesSearchedCopy.map((verse: any) => verse.book_title))
    ).sort(
      (a, b) =>
        versesSearchedCopy.findIndex((v: any) => v.book_title === a) -
        versesSearchedCopy.findIndex((v: any) => v.book_title === b)
    );
    // ^^^ supplies list of unique book titles from search results (in order they appeared)
    setBookList(uniqueBookTitles);
  };

  // This function filters the `verses` array
  // to only include verses whose book title is NOT in the `filteredBookList` array.
  const handleBookFilter = async () => {
    console.log("filtering verses...");

    const _filtered = versesSearchedCopy.filter(
      (verse) => !filteredBookList.includes(verse.book_title)
    );

    // setVerses(_filtered);
    setVersesSearchedFiltered(_filtered);

    if (pageNum > 1) setPageNum(1); //will setVerses()
    else //pageNum is 1
      setVerses(
        _filtered.slice(0, pageSize)
      );
    //^^^ if on page 1, then we'll get the subset of verses for the current page; else, pageNum change will take care of that
  };

  // select/de-select all books on filter page
  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      console.log("debug h:");
      setFilteredBookList([]);
    } else {
      console.log("debug i:");
      setFilteredBookList(bookList.slice(1));
    }

    setAllBooksSelected(e.target.checked);
  };

  return (
    <>
      {bookList.length > 1 && (
        <div className="flex w-full md:w-4/5 xl:w-3/5 justify-end mr-6 md:mr-0">
          <button
            className="btn-circle btn btn-primary"
            onClick={() => setIsOnFilterPage(!isOnFilterPage)}
          >
            <FilterIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {isOnFilterPage && (
        <>
          <div className="flex w-full lg:w-3/5 xl:w-2/5 justify-end mt-4 xl:mt-12 mr-6">
            <input
              id="selectAllFilters"
              type="checkbox"
              className="mr-2 cursor-pointer"
              onChange={(e) => handleSelectAll(e)}
              checked={allBooksSelected}
            />
            <label className="cursor-pointer" htmlFor="selectAllFilters">
              {allBooksSelected ? "De-Select All" : "Select All"}
            </label>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 xl:gap-8 my-6">
            {bookList.map((book) => (
              <div key={book} className="flex items-center">
                <input
                  type="checkbox"
                  id={book}
                  className="mr-2 cursor-pointer"
                  value={book}
                  checked={!filteredBookList.includes(book)}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      console.log("debug j:");
                      setFilteredBookList((prev) => [...prev, book]);
                    } else {
                      console.log("debug k:");
                      setFilteredBookList((prev) =>
                        prev.filter((item) => item !== book)
                      );
                    }
                  }}
                />
                <label className="cursor-pointer" htmlFor={book}>
                  {book}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

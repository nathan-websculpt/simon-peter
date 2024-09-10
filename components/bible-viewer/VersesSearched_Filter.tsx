//to filter local data (verses already searched) by book title

import { FilterIcon } from "lucide-react";
import { Dispatch, useEffect, useState } from "react";

interface FilterProps {
  verses: [];
  isFiltering: boolean;
  setIsFiltering: Dispatch<boolean>;
  setVerses: Dispatch<[]>;
  userSearchInputProcessed: string;
  versesSearchedCopy: [];
  setVersesSearchedCopy: Dispatch<[]>;
}

export const Filter = ({
  verses,
  isFiltering,
  setIsFiltering,
  setVerses,
  userSearchInputProcessed,
  versesSearchedCopy,
  setVersesSearchedCopy,
}: FilterProps) => {
  const [bookList, setBookList] = useState([]);
  const [filteredBookList, setFilteredBookList] = useState([]);

  const [hasUserFilteredThisSearchYet, setHasUserFilteredThisSearchYet] = useState(false);

  useEffect(() => {
    console.log("userSearchInputProcessed: ", userSearchInputProcessed);
    console.log("processing books-filter list...");
    setHasUserFilteredThisSearchYet(false); //this will keep us from needing to use two copies of verses UNTIL the user filters
    processBooks();
  }, [userSearchInputProcessed]);

  useEffect(() => {
    console.log("verses changing to: ", verses);
  }, [verses]);

  useEffect(() => {
    if (!isFiltering && hasUserFilteredThisSearchYet) {
      handleBookFilter();
    }
  }, [isFiltering]);

  useEffect(() => {
    if (bookList && bookList.length > 0) console.log("bookList: ", bookList);
  }, [bookList]);

  useEffect(() => {
    if(!hasUserFilteredThisSearchYet) setHasUserFilteredThisSearchYet(true);

    if (filteredBookList && filteredBookList.length > 0)
      console.log("filteredBookList: ", filteredBookList);
  }, [filteredBookList]);

  const processBooks = async () => {
    const uniqueBookTitles = Array.from(
      new Set(verses.map((verse) => verse.book_title))
    ).sort(
      (a, b) =>
        verses.findIndex((v) => v.book_title === a) -
        verses.findIndex((v) => v.book_title === b)
    );
    // ^^^ supplies list of unique book titles from search results (in order they appeared)
    setBookList(uniqueBookTitles);
  };

  // This function filters the `verses` array
  // to only include verses whose book title is NOT in the `filteredBookList` array.
  const handleBookFilter = async () => {
    console.log("filtering verses...");
    setVerses(
      versesSearchedCopy.filter(
        (verse) => !filteredBookList.includes(verse.book_title)
      )
    );
  };

  return (
    <>
      <button
        className="btn-circle btn btn-primary"
        onClick={() => setIsFiltering(!isFiltering)}
      >
        <FilterIcon className="w-6 h-6" />
      </button>

      {isFiltering && (
        <div className="grid grid-cols-2 gap-6 my-6">
          {bookList.map((book) => (
            <div key={book} className="flex items-center">
              <input
                type="checkbox"
                id={book}
                className="mr-2"
                value={book}
                defaultChecked={!filteredBookList.includes(book)}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setFilteredBookList((prev) => [...prev, book]);
                  } else {
                    setFilteredBookList((prev) =>
                      prev.filter((item) => item !== book)
                    );
                  }
                }}
              />
              <label htmlFor={book}>{book}</label>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

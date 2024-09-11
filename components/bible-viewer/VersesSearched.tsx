import { Dispatch, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "../helpers/LoadingSpinner";
import { Filter } from "./VersesSearched_Filter";
import { NoResults } from "./VersesSearched_NoResults";
import { SearchPagination } from "./VersesSearched_Pagination";

//verses from a search result,
//displayed differently than in Verses.tsx

interface VersesSearchedProps {
  verses: [];
  showSearchingSpinner: boolean;
  setVersesSearched: Dispatch<[]>;
  userSearchInputProcessed: string;
  versesSearchedCopy: [];
  setVersesSearchedFiltered: Dispatch<[]>;
  versesSearchedFiltered: [];
  setPageNum: Dispatch<number>;
  pageNum: number;
  pageSize: number;
  filteredBookList: [];
  setFilteredBookList: Dispatch<[]>;
  allBooksSelected: boolean;
  setAllBooksSelected: Dispatch<boolean>;
  searchTotalPages: number;
  setSearchTotalPages: Dispatch<number>;
}

export const VersesSearched = ({
  verses,
  showSearchingSpinner,
  setVersesSearched,
  userSearchInputProcessed,
  versesSearchedCopy,
  setVersesSearchedFiltered,
  versesSearchedFiltered,
  setPageNum,
  pageNum,
  pageSize,
  filteredBookList,
  setFilteredBookList,
  allBooksSelected,
  setAllBooksSelected,
  searchTotalPages,
  setSearchTotalPages,
}: VersesSearchedProps) => {
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isOnFilterPage, setIsOnFilterPage] = useState(false);
  const scrollToRef = useRef(null);

  useEffect(() => {
    if (!isFirstRun) handlePageChange();
    else setIsFirstRun(false);
  }, [pageNum]);

  useEffect(() => {
    console.log("Verses Searched component mounted", Date.now());
  }, []);

  const handlePageChange = () => {
    const startIndex = pageNum === 1 ? 0 : (pageNum - 1) * pageSize;
    console.log("START INDEX: ", startIndex, Date.now());

    // if verses have been filtered, paginate from filtered list
    if (versesSearchedFiltered && versesSearchedFiltered.length > 0) {
      //prevent index out of bounds on "next page"
      const endIndex =
        startIndex + pageSize < versesSearchedFiltered.length //if less-than TOTAL length
          ? startIndex + pageSize
          : versesSearchedFiltered.length;

      console.log("END INDEX: ", endIndex, Date.now());

      if (versesSearchedFiltered.length <= pageSize) setSearchTotalPages(1);
      else
        setSearchTotalPages(
          Math.ceil(versesSearchedFiltered.length / pageSize)
        ); //total number of pages; ex: 9.5 will return 10 pages

      setVersesSearched(versesSearchedFiltered.slice(startIndex, endIndex));
    } else {
      //prevent index out of bounds on "next page"
      const endIndex =
        startIndex + pageSize < versesSearchedCopy.length //if less-than TOTAL length
          ? startIndex + pageSize
          : versesSearchedCopy.length;

      console.log("END INDEX: ", endIndex, Date.now());

      if (versesSearchedCopy.length <= pageSize) setSearchTotalPages(1);
      else
        setSearchTotalPages(
          Math.ceil(versesSearchedCopy.length / pageSize)
        ); //total number of pages; ex: 9.5 will return 10 pages

      setVersesSearched(versesSearchedCopy.slice(startIndex, endIndex));
    }
  };

  return (
    <>
      {/* loading spinner and no-results */}
      <div className="flex flex-col items-center justify-center gap-1 lg:mb-12 lg:px-12 w-screen xl:w-4/5 mx-auto prose prose-xl">
        <div className="pt-10 pb-8 pl-4 pr-3 sm:mx-auto sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
          {showSearchingSpinner ? (
            <LoadingSpinner />
          ) : (
            <>{verses?.length === 0 || (!verses && <NoResults />)}</>
          )}
        </div>
      </div>

      {/* local data filter */}
      {verses && verses.length > 0 && (
        <Filter
          verses={verses}
          setIsOnFilterPage={setIsOnFilterPage}
          isOnFilterPage={isOnFilterPage}
          setVerses={setVersesSearched}
          userSearchInputProcessed={userSearchInputProcessed}
          versesSearchedCopy={versesSearchedCopy}
          setVersesSearchedFiltered={setVersesSearchedFiltered}
          pageNum={pageNum}
          setPageNum={setPageNum}
          pageSize={pageSize}
          filteredBookList={filteredBookList}
          setFilteredBookList={setFilteredBookList}
          allBooksSelected={allBooksSelected}
          setAllBooksSelected={setAllBooksSelected}
          setSearchTotalPages={setSearchTotalPages}
        />
      )}

      {/* IF NOT Filtering: display verses (search results) */}
      {/* IF Filtering: ^^^ Above filter will display books to select and de-select */}
      {!isOnFilterPage && (
        <>
          {verses && verses.length > 0 && (
            <SearchPagination
              setPageNum={setPageNum}
              pageNum={pageNum}
              searchTotalPages={searchTotalPages}
            />
          )}

          <div
            ref={scrollToRef}
            className="grid grid-cols-1 gap-2 lg:gap-4 xl:gap-8 lg:grid-cols-2 xl:grid-cols-4 mb-12 w-screen px-2 lg:px-8 xl:px-12"
          >
            {verses?.map((verse: any) => (
              <div
                key={verse.id.toString()}
                className="bg-base-200 my-6 px-4 py-2 prose prose-2xl"
              >
                <p className="px-2">{verse.verse_content}</p>
                <h5 className="text-right px-4">
                  {verse.book_title} {verse.full_verse_chapter}
                </h5>
              </div>
            ))}
          </div>

          {verses && verses.length > 0 && (
            <SearchPagination
              setPageNum={setPageNum}
              pageNum={pageNum}
              scrollTo={scrollToRef}
              searchTotalPages={searchTotalPages}
            />
          )}
        </>
      )}
    </>
  );
};

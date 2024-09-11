import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Dispatch, useEffect } from "react";

//pagination for search results, 100 verses at a time

interface SearchPagination {
  pageNum: number;
  setPageNum: Dispatch<number>;
  scrollTo: any | null | undefined;
  searchTotalPages: number;
}

export const SearchPagination = ({
  pageNum,
  setPageNum,
  scrollTo,
  searchTotalPages,
}: SearchPagination) => {
  const handleClick = (thisPageNum) => {
    setPageNum(thisPageNum);
    if (scrollTo !== null && scrollTo !== undefined) {
      window.scrollTo({
        top: scrollTo.current.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    console.log("searchTotalPages: ", searchTotalPages);
  }, [searchTotalPages]);

  return (
    <>
      <div className="flex justify-end gap-3 mx-5 mt-8 xl:mt-6 w-11/12 xl:w-4/5">
        {pageNum > 2 && (
          <>
            <button
              className="btn btn-sm btn-primary"
              disabled={pageNum === 1}
              onClick={() => handleClick(Number(1))}
              aria-label="Page One"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <span>...</span>
          </>
        )}

        {pageNum > 1 && (
          <>
            <button
              className="btn btn-sm btn-primary"
              disabled={pageNum === 1}
              onClick={() => handleClick(pageNum - Number(1))}
              aria-label="Previous Page"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
          </>
        )}

        {searchTotalPages > 1 && (
          <>
            <span className="self-center font-medium text-primary-content">
              Page {pageNum}
            </span>
          </>
        )}

        {pageNum < searchTotalPages && (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleClick(pageNum + 1)}
              aria-label="Next Page"
            >
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
};

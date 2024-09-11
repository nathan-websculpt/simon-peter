import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Dispatch } from "react";

//pagination for search results, 100 verses at a time

interface SearchPagination {
  pageNum: number;
  setPageNum: Dispatch<number>;
  scrollTo: any | null | undefined;
}

export const SearchPagination = ({
  pageNum,
  setPageNum,
  scrollTo,
}: SearchPagination) => {
  const handleClick = (thisPageNum) => {
    console.log("handleClick: ", thisPageNum);
    setPageNum(thisPageNum);
    // const thisScrollToSpot =
    //   scrollTo === null || scrollTo === undefined
    //     ? 0
    //     : scrollTo.current.offsetTop - 10;
    // window.scrollTo({ top: thisScrollToSpot, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex justify-end gap-3 mx-5 mt-5">
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

    

        <span className="self-center font-medium text-primary-content">
          Page {pageNum}
        </span>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleClick(pageNum + 1)}
          aria-label="Next Page"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

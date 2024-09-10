import { Dispatch, useEffect, useState } from "react";
import { LoadingSpinner } from "../helpers/LoadingSpinner";
import { Filter } from "./VersesSearched_Filter";
import { NoResults } from "./VersesSearched_NoResults";

//verses from a search result,
//displayed differently than in Verses.tsx

interface VersesSearchedProps {
  verses: [];
  showSearchingSpinner: boolean;
  setVersesSearched: Dispatch<[]>;
  userSearchInputProcessed: string;
  versesSearchedCopy: [];
}

export const VersesSearched = ({
  verses,
  showSearchingSpinner,
  setVersesSearched,
  userSearchInputProcessed,
  versesSearchedCopy,
}: VersesSearchedProps) => {
  const [isOnFilterPage, setIsOnFilterPage] = useState(false);

  useEffect(() => {
    console.log("Verses Searched component rendered", Date.now());
  }, []);

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

      {/* local filter */}
      {verses && verses.length > 0 && (
        <Filter
          verses={verses}
          setIsOnFilterPage={setIsOnFilterPage}
          isOnFilterPage={isOnFilterPage}
          setVerses={setVersesSearched}
          userSearchInputProcessed={userSearchInputProcessed}
          versesSearchedCopy={versesSearchedCopy}
        />
      )}

      {/* IF NOT Filtering: display verses (search results) */}
      {/* IF Filtering: ^^^ Above filter will display books to select and de-select */}
      {!isOnFilterPage && (
        <div className="grid grid-cols-1 gap-2 lg:gap-4 xl:gap-8 lg:grid-cols-2 xl:grid-cols-4 mb-12 w-screen px-2 lg:px-8 xl:px-12">
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
      )}
    </>
  );
};

// search bar, clear search button, and search button

import { handleRPC } from "@/utils/handleRPC";
import {
  MagnifyingGlassCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface SearchProps {
  userSearchInput: string;
  setUserSearchInput: (str: string) => void;
  setVersesSearched: any;
  setIsUserSearching: (value: boolean) => void;
  setShowSearchingSpinner: (value: boolean) => void;
}

export const Search = ({
  userSearchInput,
  setUserSearchInput,
  setVersesSearched,
  setIsUserSearching,
  setShowSearchingSpinner,
}: SearchProps) => {
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

  return (
    <>
      <div className="flex flex-row justify-center w-full gap-1 px-4 mx-auto mb-12 lg:w-11/12 xl:w-3/4 xl:px-0">
        <div className="flex flex-row w-11/12 xl:w-3/4">
          <input
            className="w-full h-12 pl-4 focus:outline-none bg-base-100"
            placeholder="Search by text"
            value={userSearchInput}
            onChange={(e) => setUserSearchInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
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
    </>
  );
};

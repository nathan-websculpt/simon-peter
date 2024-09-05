// search bar, clear search button, and search button

import {
  MagnifyingGlassCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface SearchProps {
  userSearchInput: string;
  handleSearch: () => void;
  clearSearch: () => void;
  setUserSearchInput: (str: string) => void;
}

export const Search = ({
  userSearchInput,
  handleSearch,
  clearSearch,
  setUserSearchInput,
}: SearchProps) => {
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

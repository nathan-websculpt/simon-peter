import { toast } from "@/lib/utils";
import { handleRPC } from "@/utils/handleRPC";
import {
  MagnifyingGlassCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, useEffect } from "react";

// search bar, clear search button, and search button

interface SearchProps {
  userSearchInput: string;
  setUserSearchInput: Dispatch<string>;
  setVersesSearched: Dispatch<any>; //todo: change 'any' and do a null-check below
  setVersesSearchedCopy: Dispatch<any>;
  setIsUserSearching: Dispatch<boolean>;
  setShowSearchingSpinner: Dispatch<boolean>;
  searchType: string;
  setUserSearchInputProcessed: Dispatch<string>;
}

export const Search = ({
  userSearchInput,
  setUserSearchInput,
  setVersesSearched,
  setVersesSearchedCopy,
  setIsUserSearching,
  setShowSearchingSpinner,
  searchType,
  setUserSearchInputProcessed,
}: SearchProps) => {
useEffect(() => {
  console.log("search rendered");
},[]);
  const handleSearch = async () => {
    console.log("debug e:");
    //validate input
    if (
      userSearchInput.trim() === "" ||
      /[~`#$%\^*+=\-\[\]\\';/{}\\":<>\?]/g.test(userSearchInput.trim())
    ) {
      toast({
        message: "Invalid Search Input",
        success: false,
      });
      return;
    }

    //determine the type of search
    let functionName: string = "";
    switch (searchType) {
      case "simple": {
        functionName = "search_simple";
        break;
      }
      case "phrase": {
        functionName = "search_phrase";
        break;
      }
      default: {
        functionName = "search_advanced"; //The only difference between advanced and custom searches is whether or not the string gets edited before the query
        break;
      }
    }

    setShowSearchingSpinner(true);
    setIsUserSearching(true);

    //process string before searching
    let newSearchString = userSearchInput.replace(/  +/g, " ").trim(); //turn all spaces into one space
    if (searchType === "advanced")
      newSearchString = newSearchString.replace(/ /g, " & "); //turn spaces into ' & '

    console.log("doing a", searchType, "search for:", newSearchString);

    const queryParams: object = {
      search_by: newSearchString,
    };
    const data: any = await handleRPC(functionName, queryParams);

    if (data) {
      if (data?.verses) {
        console.log("debug d:");
        setVersesSearched(data.verses);
        setVersesSearchedCopy(data.verses); //todo: this isn't technically necessary until the user filters
        setUserSearchInputProcessed(newSearchString); //the change of this gens new filter-book list
        toast({
          message: `${data.verses.length.toString()} Verses Returned...`,
          success: true,
        });
      } else {
        console.log("debug w:");
        setVersesSearched(null);
        setVersesSearchedCopy(null);
        toast({
          message: `0 Verses Returned...`,
          success: true,
        });
      }
    } else {
      console.log("debug c:");
      setVersesSearched(null);
      setVersesSearchedCopy(null);
      toast({
        message: `0 Verses Returned...`,
        success: true,
      });
    }
    setShowSearchingSpinner(false);
  };
  const clearSearch = async () => {
    console.log("debug a:");
    setVersesSearched(null);
    setVersesSearchedCopy(null);
    setIsUserSearching(false);
    setUserSearchInput("");
  };

  return (
    <>
      <div className="flex flex-row justify-center w-full gap-1 px-4 mx-auto mb-4 lg:w-11/12 xl:w-3/5 xl:px-0 mt-4 xl:mt-8">
        <div className="flex flex-row w-11/12 xl:w-3/5">
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

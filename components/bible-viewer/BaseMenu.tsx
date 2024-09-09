//top of Verses, displays book title and chapter number

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Dispatch } from "react";

interface BaseMenuProps {
  setSearchType: Dispatch<string>;
  setIsMenuOpen: Dispatch<boolean>;
  setIsInSearchMode: Dispatch<boolean>;
  setVersesSearched: Dispatch<[]>;
  setIsUserSearching: Dispatch<boolean>;
  setUserSearchInput: Dispatch<string>;
}

export const BaseMenu = ({
  setSearchType,
  setIsMenuOpen,
  setIsInSearchMode,
  setVersesSearched,
  setIsUserSearching,
  setUserSearchInput,
}: BaseMenuProps) => {
  const handleSearchTypeSelection = (typeSelected: string) => {
    setSearchType(typeSelected);
    setIsMenuOpen(false);
    setIsInSearchMode(true);
    
    //clear previously searched verses
    setVersesSearched(null);
    setIsUserSearching(false);
    setUserSearchInput("");
  };
  return (
    <>
      <div className="w-screen flex flex-col prose">
        <div
          className="border-t border-b border-gray-300 cursor-pointer"
          onClick={() => handleSearchTypeSelection("simple")}
        >
          <div className="pl-12 pr-6 py-12">
            <h1 className="underline">Simple Search</h1>
            <p className="prose-lg xl:prose-xl">
              A more-rigid and slower search without the help of the thesaurus.
              <br />
              Use this if you know what you are looking for.
              <br />
              performs: WHERE Verse LIKE '%YOUR_QUERY%'
            </p>
            <ArrowRightCircleIcon className="w-8 h-8 float-right" />
          </div>
        </div>

        <div
          className="border-t border-b border-gray-300 cursor-pointer"
          onClick={() => handleSearchTypeSelection("phrase")}
        >
          <div className="pl-12 pr-6 py-12">
            <h1 className="underline">Phrase Search</h1>
            <p className="prose-lg xl:prose-xl">
              A full-search against a phrase (with the thesaurus).
              <br />
              performs a phraseto_tsquery().
            </p>
            <ArrowRightCircleIcon className="w-8 h-8 float-right" />
          </div>
        </div>

        <div
          className="border-t border-b border-gray-300 cursor-pointer"
          onClick={() => handleSearchTypeSelection("advanced")}
        >
          <div className="pl-12 pr-6 py-12">
            <h1 className="underline">Advanced Search</h1>
            <p className="prose-lg xl:prose-xl">
              The app will replace your spaces for &s to perform a full-search.
              <br />
              This will return more than what you are looking for.
              <br />
              performs a to_tsquery().
            </p>
            <ArrowRightCircleIcon className="w-8 h-8 float-right" />
          </div>
        </div>

        <div
          className="border-t border-b border-gray-300 cursor-pointer"
          onClick={() => handleSearchTypeSelection("custom")}
        >
          <div className="pl-12 pr-6 py-12">
            <h1 className="underline">Custom Search</h1>
            <p className="prose-lg xl:prose-xl">
              Use this if you have done this sort of thing before, as you will
              have to type your own query string:
              <br />
              '&' = <i>and</i>
              <br />
              '|' = <i>or</i>
              <br />
              '!' = <i>negation</i>
            </p>
            <p className="prose-lg xl:prose-xl">
              Ex: "search for verses that contain <i>David</i> and <i>Nathan</i>{" "}
              but not <i>King</i>": <em>david & nathan & !king</em>
            </p>
            <ArrowRightCircleIcon className="w-8 h-8 float-right" />
          </div>
        </div>
      </div>
    </>
  );
};

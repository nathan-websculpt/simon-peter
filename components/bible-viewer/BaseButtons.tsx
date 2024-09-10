import {
  ArrowLeftIcon,
  Bars4Icon,
  BookOpenIcon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { BookAIcon, BookImageIcon } from "lucide-react";
import { Dispatch } from "react";

// Buttons that toggle book/chapter view,
// and the chapter-view contains a back button that will go back to the book view.

interface BaseButtonsProps {
  isInViewChaptersMode: boolean;
  isInViewBooksMode: boolean;
  setIsInViewBooksMode: Dispatch<boolean>;
  setIsInViewChaptersMode: Dispatch<boolean>;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<boolean>;
  setIsUserSearching: Dispatch<boolean>;
  setIsInSearchMode: Dispatch<boolean>;
  isInSearchMode: boolean;
}

export const BaseButtons = ({
  isInViewChaptersMode,
  isInViewBooksMode,
  setIsInViewBooksMode,
  setIsInViewChaptersMode,
  isMenuOpen,
  setIsMenuOpen,
  setIsUserSearching,
  setIsInSearchMode,
  isInSearchMode,
}: BaseButtonsProps) => {
  const handleToggle = () => {
    //if isInViewBooksMode is true and isinsearchmode is true, then the "book button"
    // will be used to go back to whatever page you were on; closing out the search
    if (isInSearchMode) {
      setIsUserSearching(false);
      setIsInSearchMode(false);
      return;
    }

    setIsInViewBooksMode(!isInViewBooksMode);
    setIsInViewChaptersMode(false); //either way, chapter list should be hidden
  };

  const backButtonOnChapters = async () => {
    setIsInViewChaptersMode(false);
  };

  return (
    <>
      {/* the book-view / verses-view toggle button */}
      {!isMenuOpen && (
        <>
          <div className="flex flex-row pl-4">
            <label className="btn btn-circle btn-primary swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                className="focus:outline-none"
                type="checkbox"
                onChange={handleToggle}
                checked={isInViewBooksMode}
                aria-label="Change View Mode"
              />

              {/* LIST icon */}
              <ListBulletIcon className="w-6 h-6 swap-on" />

              {/* BOOK icon */}
              <BookOpenIcon className="w-6 h-6 swap-off" />
            </label>
          </div>
        </>
      )}

      {/* menu button */}
      {!isInViewBooksMode && !isInViewChaptersMode && (
        <>
          {isMenuOpen ? (
            <button
              className="btn btn-circle btn-primary mr-4 xl:mr-0"
              onClick={() => setIsMenuOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          ) : (
            <button
              className="btn btn-circle btn-primary mr-4 xl:mr-0"
              onClick={() => setIsMenuOpen(true)}
            >
              <Bars4Icon className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* this back button is only on the chapters page - takes you back to the book list */}
      {!isMenuOpen && isInViewChaptersMode && (
        <>
          <button
            className="btn-circle btn btn-primary ml-4"
            onClick={backButtonOnChapters}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </>
  );
};

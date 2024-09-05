import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Buttons that toggle book/chapter view,
// and the chapter-view contains a back button that will go back to the book view.

interface BaseButtonsProps {
  isInViewChaptersMode: boolean;
  isInViewBooksMode: boolean;
  handleToggle: () => void;
  backButtonOnChapters: () => void;
}

export const BaseButtons = ({
  isInViewBooksMode,
  isInViewChaptersMode,
  handleToggle,
  backButtonOnChapters,
}: BaseButtonsProps) => {
  return (
    <>
      <div className="flex flex-row">
        {isInViewChaptersMode && (
          <>
            <div className="flex flex-col">
              <button
                className="btn-circle btn btn-primary"
                onClick={backButtonOnChapters}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        )}

        {/* the book-view / verses-view toggle button */}
        <div className="flex flex-col">
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

              {/* icons from: https://heroicons.com/solid */}
              {/* LIST icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 swap-on"
              >
                <path
                  fillRule="evenodd"
                  d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>

              {/* BOOK icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 swap-off"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

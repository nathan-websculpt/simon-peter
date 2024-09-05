import { LoadingSpinner } from "../helpers/LoadingSpinner";

//verses from a search result,
//displayed differently than in Verses.tsx

interface VersesSearchedProps {
  verses: [];
  showSearchingSpinner: boolean;
}

export const VersesSearched = ({
  verses,
  showSearchingSpinner,
}: VersesSearchedProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-1 mb-12 lg:justify-between lg:px-12 w-screen xl:w-4/5 mx-auto prose prose-xl">
        <div className="pt-10 pb-8 pl-4 pr-3 sm:mx-auto sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
          {showSearchingSpinner ? (
            <LoadingSpinner />
          ) : (
            <>
              {verses?.length === 0 ||
                (!verses && (
                  <div className="text-center">
                    <h1 className="font-bold">No Results Found</h1>
                    <p>Searches need to be somewhat specific, for example:</p>
                    <ul className="text-left">
                      <li>
                        <p>
                          These searches will be based on text within the verses
                        </p>
                      </li>
                      <li>
                        <p>
                          A search for <strong>"John 1:1"</strong> will not
                          return anything, but a search for{" "}
                          <strong>"in the beginning"</strong> will return{" "}
                          <strong>John 1:1</strong> (and others)
                        </p>
                      </li>
                      <li>
                        <p>
                          Searching for <strong>"in the"</strong> will not
                          return anything, but a search for{" "}
                          <strong>"in the beginning"</strong> will
                        </p>
                      </li>
                    </ul>
                  </div>
                ))}
            </>
          )}

          {verses?.map((verse: any) => (
            <div
              key={verse.id.toString()}
              className="bg-base-200 my-6 px-4 py-2 flex flex-col prose prose-2xl"
            >
              <p className="px-2">{verse.verse_content}</p>
              <h5 className="text-right px-4">
                {verse.book_title} {verse.full_verse_chapter}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

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
      <div className="flex flex-col items-center justify-center gap-1 lg:mb-12 lg:px-12 w-screen xl:w-4/5 mx-auto prose prose-xl">
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
                          The{" "}
                          <strong>
                            <u>Custom Search</u>
                          </strong>{" "}
                          requires you to type your own query string:
                          <br />
                          <strong>'&'</strong> = <i>and</i>
                          <br />
                          <strong>'|'</strong> = <i>or</i>
                          <br />
                          <strong>'!'</strong> = <i>negation</i>
                        </p>
                        <p className="prose-lg xl:prose-xl">
                          Ex: "
                          <strong>
                            search for verses that contain <i>VERILY</i> and{" "}
                            <i>SAY</i>
                            {"  "}
                            ...but not <i>UNTO</i>
                          </strong>{" "}
                          ":
                          <br />
                          <em>verily & say & !unto</em>
                        </p>
                        <p className="prose-md xl:prose-lg">
                          The search above will return 1 verse, but the search
                          below will return 81 verses:
                          <br />
                          <em>verily & say</em>
                        </p>
                      </li>
                      <li>
                        <p>
                          The{" "}
                          <strong>
                            <u>Advanced Search</u>
                          </strong>{" "}
                          is automatically turning <i>spaces</i> into <i>&</i>s,
                          meaning it will search for verses that contain the
                          words of your query
                        </p>
                      </li>
                      <li>
                        <p>
                          If you know what you are looking for, the{" "}
                          <strong>
                            <u>Simple Search</u>
                          </strong>{" "}
                          will allow for rigid phrase-searches
                        </p>
                      </li>
                      <li>
                        <p>
                          While the{" "}
                          <strong>
                            <u>Phrase Search</u>
                          </strong>{" "}
                          will perform a much-looser version of your{" "}
                          <strong>
                            <u>Simple Search</u>
                          </strong>
                        </p>
                      </li>
                    </ul>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

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
    </>
  );
};

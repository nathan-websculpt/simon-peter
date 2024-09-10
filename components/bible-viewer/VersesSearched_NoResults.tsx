//just some html for a search that returns 0 verses

export const NoResults = () => {
  return (
    <>
      <div className="text-center">
        <h1 className="font-bold">No Results Found</h1>
        <p>Searches need to be somewhat specific, for example:</p>
        <ul className="text-left">
          <li>
            <p>These searches will be based on text within the verses</p>
          </li>
          <li>
            <p>
              A search for <strong>"John 1:1"</strong> will not return anything,
              but a search for <strong>"in the beginning"</strong> will return{" "}
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
                search for verses that contain <i>VERILY</i> and <i>SAY</i>
                {"  "}
                ...but not <i>UNTO</i>
              </strong>{" "}
              ":
              <br />
              <em>verily & say & !unto</em>
            </p>
            <p className="prose-md xl:prose-lg">
              The search above will return 1 verse, but the search below will
              return 81 verses:
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
              is automatically turning <i>spaces</i> into <i>&</i>s, meaning it
              will search for verses that contain the words of your query
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
    </>
  );
};

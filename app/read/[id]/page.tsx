import { createClient } from "@/utils/supabase/server";
import { NextPageButton } from "./_components/NextPageButton";
import { PrevPageButton } from "./_components/PrevPageButton";

export interface StoredProcedureResponse {
  first_id_of_prev_page: number;
  first_id_of_next_page: number;
  verses: {
    id: number;
    full_verse_chapter: string;
    verse_content: string;
  }[];
}
async function callStoredProcedure(verseToGet: number) {
  //   "use server";
  const supabase = createClient();
  const { data, error } = await supabase.rpc("dynamic_page_builder_v_two", {
    max_string_count: 8000,
    current_verse_id: verseToGet,
  });

  if (error) {
    console.error("Error calling stored procedure:", error);
    return null;
  }
  return data[0] as StoredProcedureResponse;
  //TODO: try catch for [0]
}

type Props = { params: { id: string } };
export default async function Page({ params }: Props) {
  const thisPageObj: StoredProcedureResponse = await callStoredProcedure(
    params.id
  );

  return (
    <>
      <div className="w-4/5 mt-6">
        <div className="flex flex-row justify-around">
          <PrevPageButton prevPageId={thisPageObj.first_id_of_prev_page} />
          <NextPageButton nextPageId={thisPageObj.first_id_of_next_page} />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 mb-12 lg:justify-between lg:flex-row lg:px-12">
          <div className="pt-10 pb-8 pl-4 pr-3 mt-6 shadow-xl bg-primary sm:mx-auto sm:rounded-lg sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
            {thisPageObj?.verses?.map((verse) => (
              <span
                key={verse.id.toString()}
                className="pl-2 text-sm align-text-bottom"
              >
                {verse.full_verse_chapter}
                <span className="pl-2 text-lg align-text-top">
                  {verse.verse_content}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { First } from "@/components/bible-viewer/first";

async function call_app_first_load(version_title: string, book_title: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("app_first_load", {
    version_title: version_title,
    book_title: book_title,
  });

  if (error) {
    console.error("Error calling stored procedure:", error);
    return null;
  }
  console.log(data[0]);
  return data[0];
  //TODO: try catch for [0]
}

async function call_get_chapters_by_book_id(book_id: number) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_chapters_by_book_id", {
    book_id: book_id,
  });

  if (error) {
    console.error("Error calling stored procedure:", error);
    return null;
  }
  console.log(data[0]);
  return data[0];
  //TODO: try catch for [0]
}

async function call_get_verses_by_chapter_id(chapter_id: number) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_verses_by_chapter_id", {
    chapter_id: chapter_id,
  });

  if (error) {
    console.error("Error calling stored procedure:", error);
    return null;
  }
  console.log(data[0]);
  return data[0];
  //TODO: try catch for [0]
}

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  const initApp = async () => {
    "use server";
    const thisPageInitData: any = await call_app_first_load("KJV", "Genesis");
    return thisPageInitData;
  };

  const getChapters = async (bookId: number) => {
    "use server";
    const thisChaptersList: any = await call_get_chapters_by_book_id(bookId);
    return thisChaptersList;
  };

  const changeOutPage = async (chapterId: number) => {
    "use server";
    const thisVersesList: any = call_get_verses_by_chapter_id(chapterId);
    return thisVersesList;
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex flex-row">
        <First
          initApp={initApp}
          updateChapters={getChapters}
          updateVerses={changeOutPage}
        />
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}

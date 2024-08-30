import { getBooks, getVerses } from "@/lib/queries";

export default async function Page() {
  const verses = await getVerses();
  const books = await getBooks();
  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/5 mx-3 mt-32">
          {books?.map((book) => (
            <div className="px-16 py-6 bg-slate-500 text-xl" key={book.id}>
              {book.title}
            </div>
          ))}
        </div>
        <div className="w-4/5">
          {verses?.map((verse) => (
            <div
              className="px-16 py-12 my-6 bg-slate-500 bg-opacity-85 text-xl mx-auto"
              key={verse.id}
            >
              <span className="mr-6">{verse.fullVerseChapter}</span>
              {verse.verseContent}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

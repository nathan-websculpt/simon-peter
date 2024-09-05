//Displays all books
//When user clicks on a book, display the chapters

import { handleRPC } from "@/utils/handleRPC";
import { Dispatch } from "react";

interface ViewBooksProps {
  books: [];
  setChapters: Dispatch<[]>;
}

export const ViewBooks = ({
  books,
  setChapters,
}: ViewBooksProps) => {
  const handleChangeBook = async (e: React.SyntheticEvent) => {
    const bookId = e.target.getAttribute("data-bookid");
    const queryParams: object = {
      book_id: Number(bookId),
    };
    const data: any = await handleRPC("get_chapters_by_book_id", queryParams);
    setChapters(data?.chapters); //TODO: probably cleaner to get "chapters:" out of sproc and setChapters(data)
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mt-12 xl:mt-24 mb-12">
        {books?.map((book: any) => (
          <button
            className="btn btn-primary"
            key={book.id}
            onClick={handleChangeBook}
            data-bookid={book.id}
          >
            {book.title}
          </button>
        ))}
      </div>
    </>
  );
};

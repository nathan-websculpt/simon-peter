//Displays all books
//When user clicks on a book, display the chapters

import { handleRPC } from "@/utils/handleRPC";

interface ViewBooksProps {
  books: obj;
  setChapters: any;
}

export const ViewBooks = ({
  books,
  setChapters,
}: ViewBooksProps) => {
  const handleChangeBook = async (e) => {
    const bookId = e.target.getAttribute("data-bookid");
    const queryParams: object = {
      book_id: Number(bookId),
    };
    const data = await handleRPC("get_chapters_by_book_id", queryParams);
    setChapters(data);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mt-12 xl:mt-24 mb-12">
        {books?.map((book) => (
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

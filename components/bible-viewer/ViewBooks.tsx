//Displays all books
//When user clicks on a book, display the chapters

interface ViewBooksProps {
  handleChangeBook: () => void;
  books: obj;
}

export const ViewBooks = ({ handleChangeBook, books }: ViewBooksProps) => {
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

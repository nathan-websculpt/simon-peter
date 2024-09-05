//verses of a chapter -- like a "page" view

export const Verses = ({ verses }: any) => {
  return (
    <>
      <div className="pt-10 pb-8 pl-4 pr-3 mx-auto sm:px-10 md:pl-10 md:pr-12 xl:pl-16 xl:pr-16 2xl:pl-20 2xl:pr-16">
        {verses?.map((verse: any) => (
          <span key={verse.id.toString()} className="pl-2 align-text-bottom">
            {verse.full_verse_chapter}
            <span className="pl-2 align-text-top">{verse.verse_content}</span>
          </span>
        ))}
      </div>
    </>
  );
};

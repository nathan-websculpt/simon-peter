//Displays all chapters
//When user clicks on a chapter, displays the verses

interface ViewChaptersProps {
  handleChangeChapter: () => void;
  chapters: obj;
}

export const ViewChapters = ({
  handleChangeChapter,
  chapters,
}: ViewChaptersProps) => {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 xl:grid-cols-10 mt-12 xl:mt-24 mb-12">
        {chapters?.map((chapter) => (
          <button
            className="btn btn-primary"
            key={chapter.id}
            onClick={handleChangeChapter}
            data-chapterid={chapter.id}
          >
            {chapter.chapter_number}
          </button>
        ))}
      </div>
    </>
  );
};

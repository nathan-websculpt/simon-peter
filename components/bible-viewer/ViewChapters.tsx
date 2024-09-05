//Displays all chapters
//When user clicks on a chapter, displays the verses

import { handleRPC } from "@/utils/handleRPC";

interface ViewChaptersProps {
  setVerses: (arr: []) => void;
  setIsInViewChaptersMode: (bool: boolean) => void;
  setIsInViewBooksMode: (bool: boolean) => void;
  setCurrentBookTitle: (str: string) => void;
  setCurrentChapterTitle: (str: string) => void;
  setCurrentChapterId: any;
  chapters: obj;
}

export const ViewChapters = ({
  setVerses,
  setIsInViewChaptersMode,
  setIsInViewBooksMode,
  setCurrentBookTitle,
  setCurrentChapterTitle,
  setCurrentChapterId,
  chapters,
}: ViewChaptersProps) => {
  const handleChangeChapter = async (e) => {
    const chapterId = e.target.getAttribute("data-chapterid");
    const queryParams: object = {
      chapter_id: Number(chapterId),
    };
    const data = await handleRPC("get_verses_by_chapter_id", queryParams);

    setVerses(data.verses);

    setIsInViewChaptersMode(false);
    setIsInViewBooksMode(false);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

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

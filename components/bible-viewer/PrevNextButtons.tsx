// way to change chapters with Prev/Next buttons

import { handleRPC } from "@/utils/handleRPC";

interface PrevNextProps {
  currentChapterId: number;
  setCurrentBookTitle: (str: string) => void;
  setCurrentChapterTitle: (str: string) => void;
  setCurrentChapterId: (str: string) => void;
  setVerses: (arr: []) => void;
}
export const PrevNextButtons = ({
  currentChapterId,
  setCurrentBookTitle,
  setCurrentChapterTitle,
  setCurrentChapterId,
  setVerses,
}: PrevNextProps) => {
  const handlePrevPageClick = async (e) => {
    const queryParams: object = {
      chapter_id: Number(currentChapterId),
    };
    const data = await handleRPC("get_prev_chapter", queryParams);
    console.log("PREV CLICK: This Chapter's Verses:", data);

    setVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  const handleNextPageClick = async (e) => {
    const queryParams: object = {
      chapter_id: currentChapterId,
    };
    const data = await handleRPC("get_next_chapter", queryParams);
    console.log("NEXT CLICK: This Chapter's Verses:", data);

    setVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  return (
    <>
      <div className="flex flex-row justify-around xl:justify-between w-screen xl:w-4/5 mx-auto mt-4 mb-8">
        <button className="btn btn-primary" onClick={handlePrevPageClick}>
          PREV
        </button>

        <button className="btn btn-primary" onClick={handleNextPageClick}>
          NEXT
        </button>
      </div>
    </>
  );
};

// way to change chapters with Prev/Next buttons

import { handleRPC } from "@/utils/handleRPC";
import { Dispatch } from "react";

interface PrevNextProps {
  currentChapterId: number;
  setCurrentBookTitle: Dispatch<string>;
  setCurrentChapterTitle: Dispatch<string>;
  setCurrentChapterId: Dispatch<number>;
  setVerses: Dispatch<[]>;
}
export const PrevNextButtons = ({
  currentChapterId,
  setCurrentBookTitle,
  setCurrentChapterTitle,
  setCurrentChapterId,
  setVerses,
}: PrevNextProps) => {
  const handlePrevPageClick = async (e: React.SyntheticEvent) => {
    const queryParams: object = {
      chapter_id: Number(currentChapterId),
    };
    const data: any = await handleRPC("get_prev_chapter", queryParams);

    setVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  const handleNextPageClick = async (e: React.SyntheticEvent) => {
    const queryParams: object = {
      chapter_id: currentChapterId,
    };
    const data: any = await handleRPC("get_next_chapter", queryParams);

    setVerses(data.verses);

    setCurrentBookTitle(data.book.title);
    setCurrentChapterId(data.chapter.id);
    setCurrentChapterTitle(data.chapter.chapter_number.toString());
  };

  return (
    <>
      <div className="flex flex-row justify-around xl:justify-between w-screen md:w-11/12 xl:w-4/5 mx-auto mt-4 mb-8">
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

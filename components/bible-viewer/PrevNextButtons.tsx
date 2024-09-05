// way to change chapters with Prev/Next buttons

interface PrevNextProps {
  handlePrevPageClick: () => void;
  handleNextPageClick: () => void;
}
export const PrevNextButtons = ({
  handlePrevPageClick,
  handleNextPageClick,
}: PrevNextProps) => {
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

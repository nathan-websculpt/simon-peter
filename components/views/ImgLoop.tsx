"use client";

export function ImgLoop({ len, offset, lastImg }: { len: number, offset: number, lastImg: number }) {
  return (
    <>
        {Array.from({ length: len }, (_, i) => i + offset).map((imageNumber) => (
          <div
            key={imageNumber}
            className={
              imageNumber === lastImg
                ? ""
                : "border-b border-dashed border-opacity-50"
            }
            style={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              className="mx-auto lg:w-4/5 xl:w-3/5 my-4 xl:my-12"
              src={`/img/bible_summary_dark/${imageNumber}.png`}
              alt={`The Bible Summarized – Book ${imageNumber}`}
            />
          </div>
        ))}
    </>
  );
}

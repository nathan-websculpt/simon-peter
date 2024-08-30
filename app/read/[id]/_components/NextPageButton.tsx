import Link from "next/link";

export interface NextPageProps {
  nextPageId: number;
}

export const NextPageButton = ({ nextPageId }: NextPageProps) => {
  return (
    <>
      <div>
        {nextPageId && (
          <Link className="btn btn-primary" href={`/read/${nextPageId}`}>
            Next Page
          </Link>
        )}
      </div>
    </>
  );
};

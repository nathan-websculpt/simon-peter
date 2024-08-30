import Link from "next/link";

export interface PrevPageProps {
  prevPageId: number;
}

export const PrevPageButton = ({ prevPageId: prevPageId }: PrevPageProps) => {
  return (
    <>
      <div>
        {prevPageId && (
          <Link className="btn btn-primary" href={`/read/${prevPageId}`}>
            Prev Page
          </Link>
        )}
      </div>
    </>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import { ImgLoop } from "./ImgLoop";

// Testing amt of imgs on page w/ console: document.getElementsByTagName('img').length

export function Summaries() {
  const [firstRun, setFirstRun] = useState(true);
  const elemRefOne = useRef(null);
  const elemRefTwo = useRef(null);

  const [showSectionThree, setShowSectionThree] = useState(false);

  const callbackFunction = (entries) => {
    console.log("callbackFunction called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionThree(true);
    }
  };

  const options = { root: null, rootMargin: "0px", threshold: 1.0 };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    console.log("useEffect called");
    const observer = new IntersectionObserver(callbackFunction, options);
    if (elemRefOne.current) {
      console.log(
        "Observing the following element with IntersectionObserver",
        elemRefOne.current
      );
      observer.observe(elemRefOne.current);
    }

    return () => {
      if (elemRefOne.current) {
        console.log(
          "Unobserving the following element with IntersectionObserver",
          elemRefOne.current
        );
        observer.unobserve(elemRefOne.current);
      }
    };
  }, [options, elemRefOne]);

  return (
    <>
      {/* BOOKS OF THE LAW */}
      <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12">
        <h1 className="prose prose-2xl underline underline-offset-8">
          Books of the Law
        </h1>

        <ImgLoop len={5} offset={1} lastImg={5} />
      </div>

      {/* BOOKS OF History */}
      <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
        <h1
          className="prose prose-2xl underline underline-offset-8"
          ref={elemRefOne}
        >
          Books of History
        </h1>

        <ImgLoop len={12} offset={6} lastImg={17} />
      </div>

      {showSectionThree && (
        <>
          {/* BOOKS OF Poetry */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1 className="prose prose-2xl underline underline-offset-8">
              Books of Poetry
            </h1>

            <ImgLoop len={5} offset={18} lastImg={22} />
          </div>
        </>
      )}
    </>
  );
}

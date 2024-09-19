"use client";

import { useEffect, useRef, useState } from "react";
import { ImgLoop } from "./ImgLoop";

// Using IntersectionObserver to show/hide sections as user scrolls
// Making sections larger, because I noticed some blinking on fast srolls
// These are just X amount of images and I know the order and the structure of the images, 
// so I am not going to refactor this until I have a better idea of what it will look like in the end.

// To test amt of imgs on page w/ console: document.getElementsByTagName('img').length

export function Summaries() {
  const [firstRun, setFirstRun] = useState(true);
  const elemRefOne = useRef(null);
  const elemRefTwo = useRef(null);
  const elemRefThree = useRef(null);
  const elemRefFour = useRef(null);
  const elemRefFive = useRef(null);
  const elemRefSix = useRef(null);

  const bottomRef = useRef(null);

  const [showSectionOne, setShowSectionOne] = useState(true);
  const [showSectionTwo, setShowSectionTwo] = useState(false);
  const [showSectionThree, setShowSectionThree] = useState(false);
  const [showSectionFour, setShowSectionFour] = useState(false);
  const [showSectionFive, setShowSectionFive] = useState(false);
  const [showSectionSix, setShowSectionSix] = useState(false);
  const [showSectionSeven, setShowSectionSeven] = useState(false);
  const options = { root: null, rootMargin: "0px", threshold: 1.0 };

  // BEGIN::
  // elemRefOne IntersectionObserver
  const elemRefOneCallback = (entries) => {
    console.log("elemRefOneCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionTwo(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefOneCallback, options);
    if (elemRefOne.current) {
      console.log(
        "Observing the elemRefOne element with IntersectionObserver",
        elemRefOne.current
      );
      observer.observe(elemRefOne.current);
    }

    return () => {
      if (elemRefOne.current) {
        console.log(
          "Unobserving the elemRefOne element with IntersectionObserver",
          elemRefOne.current
        );
        observer.unobserve(elemRefOne.current);
      }
    };
  }, [options, elemRefOne]);
  //END: elemRefOne IntersectionObserver
  // END::

  // BEGIN::
  // elemRefTwo IntersectionObserver
  const elemRefTwoCallback = (entries) => {
    console.log("elemRefTwoCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionThree(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefTwoCallback, options);
    if (elemRefTwo.current) {
      console.log(
        "Observing the elemRefTwo element with IntersectionObserver",
        elemRefTwo.current
      );
      observer.observe(elemRefTwo.current);
    }

    return () => {
      if (elemRefTwo.current) {
        console.log(
          "Unobserving the elemRefTwo element with IntersectionObserver",
          elemRefTwo.current
        );
        observer.unobserve(elemRefTwo.current);
      }
    };
  }, [options, elemRefTwo]);
  //END: elemRefTwo IntersectionObserver
  // END::

  // BEGIN::
  // elemRefThree IntersectionObserver
  const elemRefThreeCallback = (entries) => {
    console.log("elemRefThreeCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionOne(false);
      setShowSectionFour(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefThreeCallback, options);
    if (elemRefThree.current) {
      console.log(
        "Observing the elemRefThree element with IntersectionObserver",
        elemRefThree.current
      );
      observer.observe(elemRefThree.current);
    }

    return () => {
      if (elemRefThree.current) {
        console.log(
          "Unobserving the elemRefThree element with IntersectionObserver",
          elemRefThree.current
        );
        observer.unobserve(elemRefThree.current);
      }
    };
  }, [options, elemRefThree]);
  //END: elemRefThree IntersectionObserver
  // END::

  // BEGIN::
  // elemRefFour IntersectionObserver
  const elemRefFourCallback = (entries) => {
    console.log("elemRefFourCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionTwo(false);
      setShowSectionFive(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefFourCallback, options);
    if (elemRefFour.current) {
      console.log(
        "Observing the elemRefFour element with IntersectionObserver",
        elemRefFour.current
      );
      observer.observe(elemRefFour.current);
    }

    return () => {
      if (elemRefFour.current) {
        console.log(
          "Unobserving the elemRefFour element with IntersectionObserver",
          elemRefFour.current
        );
        observer.unobserve(elemRefFour.current);
      }
    };
  }, [options, elemRefFour]);
  //END: elemRefFour IntersectionObserver
  // END::

  // BEGIN::
  // elemRefFive IntersectionObserver
  const elemRefFiveCallback = (entries) => {
    console.log("elemRefFiveCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionThree(false);
      setShowSectionSix(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefFiveCallback, options);
    if (elemRefFive.current) {
      console.log(
        "Observing the elemRefFive element with IntersectionObserver",
        elemRefFive.current
      );
      observer.observe(elemRefFive.current);
    }

    return () => {
      if (elemRefFive.current) {
        console.log(
          "Unobserving the elemRefFive element with IntersectionObserver",
          elemRefFive.current
        );
        observer.unobserve(elemRefFive.current);
      }
    };
  }, [options, elemRefFive]);
  //END: elemRefFive IntersectionObserver
  // END::

  // BEGIN::
  // elemRefSix IntersectionObserver
  const elemRefSixCallback = (entries) => {
    console.log("elemRefSixCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      setShowSectionFour(false);
      setShowSectionSeven(true);
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(elemRefSixCallback, options);
    if (elemRefSix.current) {
      console.log(
        "Observing the elemRefSix element with IntersectionObserver",
        elemRefSix.current
      );
      observer.observe(elemRefSix.current);
    }

    return () => {
      if (elemRefSix.current) {
        console.log(
          "Unobserving the elemRefSix element with IntersectionObserver",
          elemRefSix.current
        );
        observer.unobserve(elemRefSix.current);
      }
    };
  }, [options, elemRefSix]);
  //END: elemRefSix IntersectionObserver
  // END::

  // BEGIN::
  // bottomRef IntersectionObserver -- will open bottom section
  const bottomRefCallback = (entries) => {
    console.log("bottomRefCallback called with following entries:", entries);
    const [entry] = entries;
    console.log("entry.isIntersecting:", entry.isIntersecting);
    if (entry.isIntersecting) {
      // setShowSectionThree(true);
      // setShowSectionFour(true);
      // setShowSectionFive(true);
      //setShowSectionSix(true);
      //TODO: be sure all sections are visible
      //TODO: prevent CTRL + END from causing them to hide when scroll up
      //TODO: prevent CTRL + HOME from causing them to hide when scroll down
      //TODO: having problems with fast-scrolling past refs
    }
  };

  useEffect(() => {
    if (firstRun) {
      setFirstRun(false);
      return;
    }
    const observer = new IntersectionObserver(bottomRefCallback, options);
    if (bottomRef.current) {
      console.log(
        "Observing the bottomRef element with IntersectionObserver",
        bottomRef.current
      );
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        console.log(
          "Unobserving the bottomRef element with IntersectionObserver",
          bottomRef.current
        );
        observer.unobserve(bottomRef.current);
      }
    };
  }, [options, bottomRef]);
  //END: bottomRef IntersectionObserver
  // END::

  return (
    <>
      {showSectionOne && (
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
        </>
      )}

      {showSectionTwo && (
        <>
          {/* BOOKS OF Poetry */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1
              className="prose prose-2xl underline underline-offset-8"
              ref={elemRefTwo}
            >
              Books of Poetry
            </h1>

            <ImgLoop len={5} offset={18} lastImg={22} />
          </div>
        </>
      )}

      {showSectionThree && (
        <>
          {/* BOOKS OF Major Prophets */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1
              className="prose prose-2xl underline underline-offset-8"
              ref={elemRefThree}
            >
              Books of Major Prophets
            </h1>

            <ImgLoop len={5} offset={23} lastImg={27} />
          </div>
        </>
      )}

      {showSectionFour && (
        <>
          {/* BOOKS OF Minor Prophets */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1
              className="prose prose-2xl underline underline-offset-8"
              ref={elemRefFour}
            >
              Books of Minor Prophets
            </h1>

            <ImgLoop len={12} offset={28} lastImg={39} />
          </div>
        </>
      )}

      {showSectionFive && (
        <>
          {/* GOSPELS + ACTS */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1
              className="prose prose-2xl underline underline-offset-8"
              ref={elemRefFive}
            >
              Gospels
            </h1>

            <ImgLoop len={4} offset={40} lastImg={43} />
          </div>

          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1 className="prose prose-2xl underline underline-offset-8">
              History of the early Church
            </h1>

            <img
              className="mx-auto lg:w-4/5 xl:w-3/5 my-4 xl:my-12"
              src="/img/bible_summary_dark/44.png"
              alt="The Bible Summarized – Book 44"
            />
          </div>
        </>
      )}

      {showSectionSix && (
        <>
          {/* PAULINE EPISTLES */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1
              className="prose prose-2xl underline underline-offset-8"
              ref={elemRefSix}
            >
              Pauline Epistles
            </h1>

            <ImgLoop len={13} offset={45} lastImg={57} />
          </div>
        </>
      )}

      {showSectionSeven && (
        <>
          {/* GENERAL EPISTLES */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1 className="prose prose-2xl underline underline-offset-8">
              General Epistles
            </h1>

            <ImgLoop len={8} offset={58} lastImg={65} />
          </div>

          {/* REVELATION */}
          <div className="w-full flex flex-col gap-2 items-center mt-5 xl:mt-12 border-t pt-6 xl:pt-16">
            <h1 className="prose prose-2xl underline underline-offset-8">
              The Revelation of Jesus Christ
            </h1>

            <img
              className="mx-auto lg:w-4/5 xl:w-3/5 my-4 xl:my-12"
              src="/img/bible_summary_dark/66.png"
              alt="The Bible Summarized – Book 66"
            />
          </div>
        </>
      )}

      {/* TODO: add bottom ref */}
      {/* <div ref={bottomRef}></div> */}
    </>
  );
}

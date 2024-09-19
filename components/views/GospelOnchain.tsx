"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export interface GospelOnchainProps {
  setIsInGospelOnchainView: Dispatch<React.SetStateAction<boolean>>;
}
export function GospelOnchain({
  setIsInGospelOnchainView,
}: GospelOnchainProps) {
  return (
    <>
      <article className="px-4 mx-auto mt-8 lg:mt-12 mb-12 prose lg:prose-lg md:px-0">
        <div className="lg:w-4/5 xl:w-3/5 flex flex-col mb-8 xl:mb-10">
          <button
            className="btn-circle btn btn-primary ml-4"
            onClick={() => setIsInGospelOnchainView(false)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
        <h1>Gospel Onchain</h1>
        <h2>An endeavor to store the Bible onchain</h2>
        <h3>Could “crypto” become a new way to protect scripture?</h3>
        <p>
          In May of 2024, I successfully stored the{" "}
          <Link
            href="https://www.gospelonchain.com/"
            target="_blank"
            className="link"
          >
            Gospel of John directly onto the blockchain
          </Link>{" "}
          (verse-by-verse)... <i>Not as an NFT.</i>
        </p>
        <p>
          I am working towards decentralized and distributed solutions that can
          protect text against tyranny, and I firmly believe that the blockchain
          could provide a decentralized and immutable record of the Bible
          &mdash; a way to ensure that the scriptures are:
        </p>
        <ul>
          <li>unbannable</li>
          <li>unburnable</li>
          <li>unchangeable</li>
          <li>and available to all</li>
        </ul>
        <p>
          Making books/documents unbannable can mean that everyone has access to
          them &mdash; regardless of geopolitical or ideological restrictions.
          Readers all over the world could freely engage with these texts
          without fear of censorship.
        </p>
        <Link
          href="https://www.gospelonchain.com/read"
          target="_blank"
          className="link"
        >
          <h2 className="flex flex-col pb-6 text-2xl xl:text-5xl">
            <span className="font-thin">Read [from the blockchain] Now: </span>
            (KJV) Gospel of John
          </h2>
        </Link>{" "}
        <p>
          {" "}
          Please check out the 'About Page' to learn more about the multiple
          ways I have approached this idea:{" "}
          <Link
            href="https://www.gospelonchain.com/about"
            target="_blank"
            className="link"
          >
            https://www.gospelonchain.com/about
          </Link>
        </p>
        <p>
          I feel strongly that a council-of-members should vote (verse-by-verse)
          on each book before a single sentence is considered confirmed, but
          without teams of people willing to be a part of it and people willing
          to fund it, I have currently been reduced to storing these books
          myself and allowing for the ability to confirm verses after the fact.
        </p>
        <p>
          I love the idea of doing this with a council, and you can see the code
          for that project here:{" "}
          <Link
            href="https://github.com/nathan-websculpt/council"
            target="_blank"
            className="link"
          >
            https://github.com/nathan-websculpt/council
          </Link>
        </p>
        <p>
          Here is the code for Gospel Onchain:{" "}
          <Link
            href="https://github.com/nathan-websculpt/gospel"
            target="_blank"
            className="link"
          >
            https://github.com/nathan-websculpt/gospel
          </Link>
        </p>
        <p>
          Here is the code for this project (a web2 Bible):{" "}
          <Link
            href="https://github.com/nathan-websculpt/simon-peter"
            target="_blank"
            className="link"
          >
            https://github.com/nathan-websculpt/simon-peter
          </Link>
        </p>
        <p>
          And this repo to see how a (self-governed) council-of-members can have
          access to donations: <span> </span>
          <a
            href="https://github.com/nathan-websculpt/general-fund"
            target="_blank"
            className="link"
          >
            'general-fund'
          </a>
          .
        </p>
        <p className="lead">
          <em>If you wish to donate</em>, simply send funds to:{" "}
        </p>
        <ul>
          <li>
            <strong>websculpt.eth</strong>
          </li>
          <li>
            <strong className="break-all">
              0x1e7aAbB9D0C701208E875131d0A1cFcDAba79350
            </strong>
          </li>
        </ul>
        <p>
          My most-sincere feeling of gratitude goes to anyone wanting to help
          out.
        </p>
      </article>
    </>
  );
}

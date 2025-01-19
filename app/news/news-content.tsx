"use client";

import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newsShort } from "@/app/news/news";

export function NewsContent({
  isShortVersion = false,
  newsCount,
}: {
  isShortVersion?: boolean;
  newsCount?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  let news = newsShort.slice().reverse();
  if (newsCount && newsCount < news.length) {
    news = news.slice(0, newsCount);
  }

  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={`bg-mtc-background text-mtc-black max-w-4xl flex flex-col items-center`}
      >
        <div className={"text-3xl font-bold text-center"}>UNSERE NEWS</div>
        <hr className={"border-mtc-black md:w-full w-5/6 my-8"} />
        {news.map((news, index) => (
          <div key={index} className={"flex flex-col items-center"}>
            {isBigScreen ? (
              <div className={"flex"}>
                <Image
                  src={news.image}
                  alt={"News Image"}
                  className={"object-cover w-1/4 grow-2"}
                ></Image>
                <div className={"flex flex-col shrink px-8"}>
                  <h3 className={"text-xl font-bold pb-8"}>{news.header}</h3>
                  {Array.isArray(news.text) ? (
                    news.text.map((text, index) => (
                      <p key={index} className={"pb-4"}>
                        {text}
                      </p>
                    ))
                  ) : (
                    <p>{news.text}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className={"flex flex-col"}>
                <h3 className={"text-xl font-bold text-center my-8"}>
                  {news.header}
                </h3>
                <Image
                  src={news.image}
                  alt={"News Image"}
                  className={""}
                ></Image>
                {Array.isArray(news.text) ? (
                  news.text.map((text, index) => (
                    <p key={index} className={"text-center m-8"}>
                      {text}
                    </p>
                  ))
                ) : (
                  <p className={"text-center m-8"}>{news.text}</p>
                )}
              </div>
            )}
            {index !== newsShort.length - 1 && (
              <hr className={"border-mtc-black my-8 px-8 md:w-full w-5/6 "} />
            )}
          </div>
        ))}
        {isShortVersion ? (
          <Link href={"/news"} className={"self-center py-16"}>
            <button
              className={
                "bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"
              }
            >
              MEHR BERICHTE
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

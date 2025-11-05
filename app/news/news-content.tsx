"use client";

import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/app/news/article-loader";

export function NewsContent({
  isShortVersion = false,
  newsCount,
}: {
  isShortVersion?: boolean;
  newsCount?: number;
}) {
  const [isClient, setIsClient] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const allArticles = getArticles(); // Already sorted newest first
  let newsArticles = allArticles.slice();

  // Prepare images for the lightbox
  const images = newsArticles.map((item) => ({
    src:
      typeof item.image.src === "string" ? item.image.src : item.image.src.src,
    width: item.image.width,
    height: item.image.height,
    title: item.header,
  }));

  // Handler for closing the lightbox
  const handleLightboxClose = () => {
    setLightboxOpen(false);
    setLightboxIndex(0);
  };

  // Handler for changing slides
  const handleLightboxIndexChange = (newIndex: number) => {
    setLightboxIndex(newIndex);
  };
  // Set isClient to true, when this component is in client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (newsCount && newsCount < newsArticles.length) {
    newsArticles = newsArticles.slice(0, newsCount);
  }

  // For the full news page, show a limited number first and allow loading more
  const displayedArticles = isShortVersion ? newsArticles : newsArticles.slice(0, visibleCount);

  const recentCount = allArticles.filter((article) => {
    if (!article.releaseDate) return false;
    const articleDate = new Date(article.releaseDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - articleDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  // Build set of recent article ids (releaseDate within last 30 days)
  const recentIds = new Set<string>();
  if (recentCount > 0) {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(now.getDate() - 30);
    for (const a of allArticles) {
      if (!a.releaseDate) continue;
      const d = new Date(a.releaseDate);
      if (d >= oneMonthAgo && d <= now) recentIds.add(a.id);
    }
  }

  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={`bg-mtc-background text-mtc-black max-w-4xl flex flex-col items-center`}
      >
        <div className={"text-3xl font-bold text-center"}>UNSERE NEWS</div>
        <hr className={"border-mtc-black md:w-full w-5/6 my-8"} />
        {displayedArticles.map((news, index) => (
          <div key={index} className={"flex flex-col items-center"}>
            {isBigScreen ? (
              <div className={"flex"}>
                <Image
                  src={news.image.src}
                  width={news.image.width}
                  height={news.image.height}
                  alt={"News Image"}
                  className={"object-cover w-1/4 grow-2 cursor-pointer"}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                />
                <div className={"flex flex-col shrink px-8"}>
                  <div
                    className={
                      "min-h-[1.5em] pb-6 text-sm text-mtc-black/70 w-full relative"
                    }
                  >
                    <div className="flex items-center gap-2 w-full">
                      <h3 className={"text-xl font-bold text-mtc-black"}>
                        {news.header}
                      </h3>
                      {recentIds.has(news.id) && (
                        <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow flex-shrink-0 self-center leading-none">
                          NEU
                        </span>
                      )}
                    </div>

                    {news.date && (
                      <span>
                        {new Date(news.date).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
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
                <div className="flex justify-center gap-2 w-full mt-8">
                  <h3 className={"text-xl font-bold text-center"}>
                    {news.header}
                  </h3>
                  {recentIds.has(news.id) && (
                    <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow self-center leading-none">
                      NEU
                    </span>
                  )}
                </div>
                <div
                  className={
                    "min-h-[1.5em] mb-6 text-sm text-mtc-black/70 text-center"
                  }
                >
                  {news.date && (
                    <span>
                      {new Date(news.date).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <Image
                  src={news.image.src}
                  width={news.image.width}
                  height={news.image.height}
                  alt={"News Image"}
                  className={"cursor-pointer"}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                />
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
            {index !== displayedArticles.length - 1 && (
              <hr className={"border-mtc-black my-8 px-8 md:w-full w-5/6 "} />
            )}
          </div>
        ))}
        {/* Lightbox overlay for images - render only once */}
        <Lightbox
          open={lightboxOpen}
          close={handleLightboxClose}
          slides={images}
          index={lightboxIndex}
          carousel={{ finite: false }}
          on={{
            view: ({ index }) => handleLightboxIndexChange(index),
          }}
        />
        {/* Load more button for full news page */}
        {!isShortVersion && visibleCount < newsArticles.length && (
          <div className={"flex justify-center py-16"}>
            <button
              onClick={() => setVisibleCount((v) => Math.min(newsArticles.length, v + 6))}
              className={
                "bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"
              }
            >
              MEHR LADEN
            </button>
          </div>
        )}
        {isShortVersion ? (
          <Link href={"/news"} className={"self-center py-16"}>
            <div className="relative inline-block">
              <button
                className={
                  "bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"
                }
              >
                MEHR BERICHTE
              </button>

              {/* Show a pulsing badge with the number of articles added in the last 30 days */}
              {recentCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-pulse">
                  {recentCount >= 100 ? "99+" : `${recentCount}`}
                </span>
              )}
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

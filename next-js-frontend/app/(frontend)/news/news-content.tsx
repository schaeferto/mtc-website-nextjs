"use client";

import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import Link from "next/link";
import { PiImagesLight } from "react-icons/pi";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { News, NewsMedia } from "@/payload-types";

// images[].image is always populated (NewsMedia) at depth 1
type ImageEntry = { image: NewsMedia; isCover?: boolean | null; id?: string | null };

function getCoverAndExtras(article: News) {
  const all = (article.images ?? []) as ImageEntry[];
  const coverIdx = Math.max(0, all.findIndex(i => i.isCover));
  return {
    cover: all[coverIdx] ?? null,
    extras: all.filter((_, i) => i !== coverIdx),
  };
}

function buildSlides(article: News) {
  const toSlide = (img: NewsMedia, title?: string) => ({
    src: img.url ?? "",
    width: img.width ?? undefined,
    height: img.height ?? undefined,
    alt: img.alt,
    title,
  });
  const { cover, extras } = getCoverAndExtras(article);
  if (!cover) return [];
  return [toSlide(cover.image, article.header), ...extras.map(e => toSlide(e.image))];
}

export function NewsContent({
  isShortVersion = false,
  newsCount,
  articles,
}: {
  isShortVersion?: boolean;
  newsCount?: number;
  articles: News[];
}) {
  const [isClient, setIsClient] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<ReturnType<typeof buildSlides>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  let displayArticles = newsCount ? articles.slice(0, newsCount) : articles.slice();
  const fullArticles = displayArticles;

  const displayedArticles = isShortVersion
    ? displayArticles
    : displayArticles.slice(0, visibleCount);

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(now.getDate() - 30);

  const recentIds = new Set<number>();
  for (const a of fullArticles) {
    const d = new Date(a.releaseDate ?? a.createdAt);
    if (d >= oneMonthAgo && d <= now) recentIds.add(a.id);
  }
  const recentCount = recentIds.size;

  function openLightbox(article: News, startIndex = 0) {
    setLightboxSlides(buildSlides(article));
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }

  return (
    <div className={"flex flex-col items-center"}>
      <div className={"bg-mtc-background text-mtc-black max-w-4xl flex flex-col items-center"}>
        <div className={"text-3xl font-bold text-center"}>UNSERE NEWS</div>
        <hr className={"border-mtc-black md:w-full w-5/6 my-8"} />

        {displayedArticles.map((news, index) => {
          const { cover } = getCoverAndExtras(news);
          const totalImages = (news.images ?? []).length;
          const hasGallery = totalImages > 1;

          return (
            <div key={news.id} className={"flex flex-col items-center w-full"}>
              {isBigScreen ? (
                <div className={"flex w-full"}>
                  {/* Image column */}
                  <div className={"shrink-0 w-1/4"}>
                    {cover && (
                      <div
                        className={"relative aspect-[4/3] overflow-hidden cursor-pointer"}
                        onClick={() => openLightbox(news, 0)}
                      >
                        <Image
                          src={cover.image.url ?? ""}
                          fill
                          sizes="25vw"
                          alt={cover.image.alt}
                          className={"object-cover"}
                        />
                        {hasGallery && (
                          <div className={"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"}>
                            <PiImagesLight size={14} />
                            {totalImages}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Text column */}
                  <div className={"flex flex-col shrink px-8"}>
                    <div className={"min-h-[1.5em] pb-6 text-sm text-mtc-black/70 w-full relative"}>
                      <div className="flex items-center gap-2 w-full">
                        <h3 className={"text-xl font-bold text-mtc-black"}>{news.header}</h3>
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
                            timeZone: "Europe/Berlin",
                          })}
                        </span>
                      )}
                    </div>
                    {news.content && <RichText data={news.content} className={"[&_p]:pb-4"} />}
                  </div>
                </div>
              ) : (
                <div className={"flex flex-col w-full"}>
                  <div className="flex justify-center gap-2 w-full mt-8 relative">
                    <h3 className={"text-xl font-bold text-center"}>{news.header}</h3>
                    {recentIds.has(news.id) && (
                      <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow self-center leading-none absolute -top-6 right-2">
                        NEU
                      </span>
                    )}
                  </div>
                  <div className={"min-h-[1.5em] mb-6 text-sm text-mtc-black/70 text-center"}>
                    {news.date && (
                      <span>
                        {new Date(news.date).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "Europe/Berlin",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Cover image */}
                  {cover && (
                    <div
                      className={"relative aspect-[4/3] overflow-hidden cursor-pointer"}
                      onClick={() => openLightbox(news, 0)}
                    >
                      <Image
                        src={cover.image.url ?? ""}
                        fill
                        sizes="100vw"
                        alt={cover.image.alt}
                        className={"object-cover"}
                      />
                      {hasGallery && (
                        <div className={"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"}>
                          <PiImagesLight size={14} />
                          {totalImages}
                        </div>
                      )}
                    </div>
                  )}

                  {news.content && <RichText data={news.content} className={"[&_p]:text-center [&_p]:m-8"} />}
                </div>
              )}

              {index !== displayedArticles.length - 1 && (
                <hr className={"border-mtc-black my-8 px-8 md:w-full w-5/6"} />
              )}
            </div>
          );
        })}

        <Lightbox
          open={lightboxOpen}
          close={() => { setLightboxOpen(false); setLightboxIndex(0); }}
          slides={lightboxSlides}
          index={lightboxIndex}
          carousel={{ finite: false }}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
        />

        {!isShortVersion && visibleCount < fullArticles.length && (
          <div className={"flex justify-center py-16"}>
            <button
              onClick={() => setVisibleCount((v) => Math.min(fullArticles.length, v + 6))}
              className={"bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"}
            >
              MEHR LADEN
            </button>
          </div>
        )}

        {isShortVersion && (
          <Link href={"/news"} className={"self-center py-16"}>
            <div className="relative inline-block">
              <button className={"bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"}>
                MEHR BERICHTE
              </button>
              {recentCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-pulse">
                  {recentCount >= 100 ? "99+" : `${recentCount}`}
                </span>
              )}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

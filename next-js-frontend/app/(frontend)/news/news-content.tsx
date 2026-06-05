"use client";

import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { News, NewsMedia } from "@/payload-types";

type ImageEntry = { image: NewsMedia; isCover?: boolean | null; id?: string | null };

const focalPointClass: Record<string, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

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
    alt: img.alt ?? "",
    title,
  });
  const { cover, extras } = getCoverAndExtras(article);
  if (!cover) return [];
  return [toSlide(cover.image, article.header), ...extras.map(e => toSlide(e.image))];
}

// Same order as buildSlides: cover first, then extras
function getOrderedImages(article: News): ImageEntry[] {
  const { cover, extras } = getCoverAndExtras(article);
  return cover ? [cover, ...extras] : [];
}

function DesktopImageGrid({
  images,
  onImageClick,
}: {
  images: ImageEntry[];
  onImageClick: (index: number) => void;
}) {
  const total = images.length;
  if (total === 0) return null;

  if (total === 1) {
    return (
      <div
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0].image.url ?? ""}
          fill
          sizes="40vw"
          alt={images[0].image.alt ?? ""}
          className={`object-cover ${focalPointClass[images[0].image.focalPoint ?? "center"] ?? "object-center"}`}
        />
      </div>
    );
  }

  if (total === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 aspect-square">
        {images.slice(0, 2).map((img, i) => (
          <div
            key={img.id ?? i}
            className="relative overflow-hidden cursor-pointer"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={img.image.url ?? ""}
              fill
              sizes="20vw"
              alt={img.image.alt ?? ""}
              className={`object-cover ${focalPointClass[img.image.focalPoint ?? "center"] ?? "object-center"}`}
            />
          </div>
        ))}
      </div>
    );
  }

  // 3+ images: bento — large main (left 3/4), two thumbnails stacked (right 1/4)
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-0.5 aspect-square">
      <div
        className="col-span-3 row-span-2 relative overflow-hidden cursor-pointer"
        onClick={() => onImageClick(0)}
      >
        <Image
          src={images[0].image.url ?? ""}
          fill
          sizes="30vw"
          alt={images[0].image.alt ?? ""}
          className={`object-cover ${focalPointClass[images[0].image.focalPoint ?? "center"] ?? "object-center"}`}
        />
      </div>
      <div
        className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer"
        onClick={() => onImageClick(1)}
      >
        <Image
          src={images[1].image.url ?? ""}
          fill
          sizes="10vw"
          alt={images[1].image.alt ?? ""}
          className={`object-cover ${focalPointClass[images[1].image.focalPoint ?? "center"] ?? "object-center"}`}
        />
      </div>
      <div
        className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer"
        onClick={() => onImageClick(2)}
      >
        <Image
          src={images[2].image.url ?? ""}
          fill
          sizes="10vw"
          alt={images[2].image.alt ?? ""}
          className={`object-cover ${focalPointClass[images[2].image.focalPoint ?? "center"] ?? "object-center"}`}
        />
        {total > 3 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-2xl pointer-events-none">
            +{total - 3}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileCarousel({
  images,
  onImageClick,
}: {
  images: ImageEntry[];
  onImageClick: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function scrollToIndex(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleScroll}
      >
        {images.map((img, i) => (
          <div
            key={img.id ?? i}
            className="relative flex-shrink-0 w-full aspect-[4/3] snap-start overflow-hidden cursor-pointer"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={img.image.url ?? ""}
              fill
              sizes="100vw"
              alt={img.image.alt ?? ""}
              className={`object-cover ${focalPointClass[img.image.focalPoint ?? "center"] ?? "object-center"}`}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 pt-3 pb-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i === activeIndex ? "bg-mtc-black" : "bg-mtc-black/30"
              }`}
              aria-label={`Bild ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
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

  const displayArticles = newsCount ? articles.slice(0, newsCount) : articles.slice();
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
  function openLightbox(article: News, startIndex = 0) {
    setLightboxSlides(buildSlides(article));
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-mtc-background text-mtc-black max-w-4xl w-full flex flex-col items-center">
        <div className="text-3xl font-bold text-center">UNSERE NEWS</div>
        <hr className="border-mtc-black md:w-full w-5/6 my-8" />

        {displayedArticles.map((news, index) => {
          const orderedImages = getOrderedImages(news);
          const isReversed = index % 2 === 1;

          return (
            <div key={news.id} className="flex flex-col items-center w-full">
              {isBigScreen ? (
                <div className={`flex w-full gap-8 ${isReversed ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Image column */}
                  <div className="w-2/5 shrink-0">
                    <DesktopImageGrid
                      images={orderedImages}
                      onImageClick={(i) => openLightbox(news, i)}
                    />
                  </div>

                  {/* Text column */}
                  <div className="flex flex-col flex-1 justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-mtc-black">{news.header}</h3>
                      {recentIds.has(news.id) && (
                        <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow flex-shrink-0 leading-none">
                          NEU
                        </span>
                      )}
                    </div>
                    {news.date && (
                      <p className="text-sm text-mtc-black/70 mb-4">
                        {new Date(news.date).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "Europe/Berlin",
                        })}
                      </p>
                    )}
                    {news.content && <RichText data={news.content} className="[&_p]:pb-4" />}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <div className="flex justify-center gap-2 w-full mt-8 mb-1 relative">
                    <h3 className="text-xl font-bold text-center">{news.header}</h3>
                    {recentIds.has(news.id) && (
                      <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow self-center leading-none absolute -top-6 right-2">
                        NEU
                      </span>
                    )}
                  </div>
                  {news.date && (
                    <p className="text-sm text-mtc-black/70 text-center mb-4">
                      {new Date(news.date).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "Europe/Berlin",
                      })}
                    </p>
                  )}

                  <MobileCarousel
                    images={orderedImages}
                    onImageClick={(i) => openLightbox(news, i)}
                  />

                  {news.content && (
                    <RichText data={news.content} className="[&_p]:text-center [&_p]:m-8" />
                  )}
                </div>
              )}

              {index !== displayedArticles.length - 1 && (
                <hr className="border-mtc-black my-8 px-8 md:w-full w-5/6" />
              )}
            </div>
          );
        })}

        <Lightbox
          open={lightboxOpen}
          close={() => {
            setLightboxOpen(false);
            setLightboxIndex(0);
          }}
          slides={lightboxSlides}
          index={lightboxIndex}
          carousel={{ finite: false }}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
        />

        {!isShortVersion && visibleCount < fullArticles.length && (
          <div className="flex justify-center py-16">
            <button
              onClick={() => setVisibleCount((v) => Math.min(fullArticles.length, v + 6))}
              className="bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium"
            >
              MEHR LADEN
            </button>
          </div>
        )}

        {isShortVersion && (
          <Link href="/news" className="self-center py-16">
            <div className="relative inline-block">
              <button className="bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium">
                MEHR BERICHTE
              </button>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

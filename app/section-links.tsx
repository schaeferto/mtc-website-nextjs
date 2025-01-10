"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import homeLeagueImage from "@/public/home_liga.jpg";
import homeTrainingImage from "@/public/home_training.jpg";
import homeContactImage from "@/public/home_contact.jpg";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { ImageWithTextAndLink } from "@/app/image-with-textoverlay";

export function SectionLinks() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={"flex flex-col items-center my-16 "}>
      <div className="embla md:max-w-[768px]">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0">
              <ImageWithTextAndLink
                href={"/league"}
                src={homeLeagueImage}
                alt={"Liga"}
                text={"Liga"}
              />
            </div>
            <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0">
              <ImageWithTextAndLink
                href={"/training"}
                src={homeTrainingImage}
                alt={"Training"}
                text={"Training"}
              />
            </div>
            <div className="embla__slide basis-10/12 px-2 shrink-0 grow-0">
              <ImageWithTextAndLink
                href={"/join"}
                src={homeContactImage}
                alt={"Kontakt"}
                text={"Kontakt"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={"hidden md:flex items-center mt-4 gap-4"}>
        <button
          className="embla__prev text-black border-solid border-mtc-black border-2 rounded-full"
          onClick={scrollPrev}
        >
          <PiCaretLeft size={30} />
        </button>
        <button
          className="embla__next text-black border-solid border-mtc-black border-2 rounded-full"
          onClick={scrollNext}
        >
          <PiCaretRight size={30} />
        </button>
      </div>
    </div>
  );
}

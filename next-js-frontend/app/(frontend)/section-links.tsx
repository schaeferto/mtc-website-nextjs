import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import homeLeagueImage from "@/public/home_liga.jpg";
import homeTrainingImage from "@/public/home_training.jpg";
import homeContactImage from "@/public/home_contact.jpg";

type Tile = { href: string; src: StaticImageData; label: string };

const tiles: Tile[] = [
  { href: "/league", src: homeLeagueImage, label: "Liga" },
  { href: "/join", src: homeTrainingImage, label: "Training" },
  { href: "/join", src: homeContactImage, label: "Kontakt" },
];

/** Drei Waben, auf großen Screens wie in einem Bienenstock versetzt. */
export function SectionLinks() {
  return (
    <section className="px-4 my-16" aria-label="Bereiche">
      <ul className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
        {tiles.map((tile, i) => (
          <li
            key={tile.label}
            className={`w-[280px] md:w-[300px] ${
              i === 1 ? "md:mt-[150px] md:-mx-[60px]" : ""
            } ${i % 2 === 1 ? "self-end md:self-auto" : "self-start md:self-auto"}`}
          >
            <Link
              href={tile.href}
              className="group relative block aspect-[1.15] focus-visible:outline-none"
            >
              <span
                className="wabe absolute inset-0 bg-hummel-pollen scale-[1.04] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              />
              <span className="wabe absolute inset-0 overflow-hidden">
                <Image
                  src={tile.src}
                  alt=""
                  sizes="300px"
                  className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute inset-0 bg-hummel-pelz/45 group-hover:bg-hummel-pelz/25 transition-colors" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-extrabold text-white">
                {tile.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

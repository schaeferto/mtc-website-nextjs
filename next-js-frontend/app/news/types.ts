import { StaticImageData } from "next/image";

export type NewsArticle = {
  id: string;
  image: { src: StaticImageData; width: number; height: number };
  header: string;
  text: string | string[];
  date?: string;
  releaseDate?: string;
  slug?: string;
};
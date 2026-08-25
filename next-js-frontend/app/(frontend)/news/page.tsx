import { NewsContent } from "@/app/(frontend)/news/news-content";
import { getPublishedNews } from "@/lib/news";

export default async function News() {
  const articles = await getPublishedNews();
  return (
    <div className={"py-12 first-content"}>
      <NewsContent articles={articles} />
    </div>
  );
}

import { getPayload } from "payload";
import config from "@payload-config";
import type { News } from "@/payload-types";

export async function getPublishedNews(limit = 100): Promise<News[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    where: { published: { equals: true } },
    sort: "-date",
    limit,
    depth: 1,
  });
  return result.docs as unknown as News[];
}

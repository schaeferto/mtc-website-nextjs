import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const start = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const [swimming, running] = await Promise.all([
      payload.find({
        collection: "trainings",
        where: {
          discipline: { equals: "Schwimmen" },
          isDisabled: { not_equals: true },
          date: { greater_than_equal: start },
        },
        sort: "date",
        depth: 2,
        limit: 6,
      }),
      payload.find({
        collection: "trainings",
        where: {
          discipline: { equals: "Laufen" },
          isDisabled: { not_equals: true },
          date: { greater_than_equal: start },
        },
        sort: "date",
        depth: 2,
        limit: 3,
      }),
    ]);

    const docs = [...swimming.docs, ...running.docs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return Response.json(docs);
  } catch (err) {
    console.error("event-options error:", err);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !token) {
      return Response.json({ error: "Strapi not configured" }, { status: 500 });
    }

    const response = await fetch(
      `${strapiUrl}/api/events?populate[training]=true&populate[location]=true&sort=date:asc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 10 },
      },
    );

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    const events = data.data.map((e: any) => ({
      id: e.id,
      documentId: e.documentId,
      date: e.date,
      training: {
        id: e.training.id,
        documentId: e.training.documentId,
        title: e.training.title,
      },
      location: e.location
        ? {
          name: e.location.name,
          imageName: e.location.imageName,
        }
        : null,
    }));

    return Response.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

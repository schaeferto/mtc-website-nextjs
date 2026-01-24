export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !token) {
      return Response.json({ error: "Strapi not configured" }, { status: 500 });
    }

    const response = await fetch(
      `${strapiUrl}/api/trainings?sort=date:asc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 10 },
      },
    );

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    const events = data.data.map((t: any) => ({
      id: t.id,
      documentId: t.documentId,
      date: t.date,
      training: {
        id: t.trainingType === 'swimming' ? 1 : 2, // Mock ID based on static list
        documentId: t.trainingType,
        title: t.trainingType.charAt(0).toUpperCase() + t.trainingType.slice(1),
      },
      location: {
        name: t.locationName,
        imageName: t.imageName,
      },
    }));

    return Response.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

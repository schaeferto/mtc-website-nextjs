export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !token) {
      return Response.json({ error: "Strapi not configured" }, { status: 500 });
    }

    const response = await fetch(`${strapiUrl}/api/trainings`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();
    const trainings = data.data.map((t: any) => ({
      id: t.id,
      documentId: t.documentId,
      title: t.title,
    }));

    return Response.json(trainings);
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return Response.json(
      { error: "Failed to fetch trainings" },
      { status: 500 },
    );
  }
}

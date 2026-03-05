export const dynamic = "force-dynamic";

/**
 * Fetch trainings with timeout and retry logic
 */
async function fetchTrainingsWithTimeout(
  url: string,
  token: string,
  signal: AbortSignal,
  timeoutMs: number = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.any([signal, controller.signal]),
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET() {
  const controller = new AbortController();
  const mainTimeoutId = setTimeout(() => controller.abort(), 15000); // 15 second overall timeout

  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;

    if (!strapiUrl || !token) {
      return Response.json({ error: "Strapi not configured" }, { status: 500 });
    }

    // Get current date and date 3 weeks from now
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const threeWeeksFromNow = new Date(now);
    threeWeeksFromNow.setDate(threeWeeksFromNow.getDate() + 21);

    // Format dates for Strapi filter (ISO format)
    const startDate = now.toISOString().split("T")[0];
    const endDate = threeWeeksFromNow.toISOString().split("T")[0];

    // Fetch swimming and running trainings in parallel with limits
    const [swimmingResponse, runningResponse] = await Promise.all([
      fetchTrainingsWithTimeout(
        `${strapiUrl}/api/trainings?filters[trainingType][$eq]=swimming&filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&sort=date:asc&pagination[limit]=50`,
        token,
        controller.signal,
        10000,
      ),
      fetchTrainingsWithTimeout(
        `${strapiUrl}/api/trainings?filters[trainingType][$eq]=running&filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&sort=date:asc&pagination[limit]=50`,
        token,
        controller.signal,
        10000,
      ),
    ]);

    clearTimeout(mainTimeoutId);

    if (!swimmingResponse.ok || !runningResponse.ok) {
      const failedStatus = !swimmingResponse.ok
        ? swimmingResponse.status
        : runningResponse.status;
      console.error(`Strapi error: ${failedStatus}`);
      throw new Error(`Strapi error: ${failedStatus}`);
    }

    const swimmingData = await swimmingResponse.json();
    const runningData = await runningResponse.json();

    // Combine both datasets
    const allTrainings = [
      ...(swimmingData.data || []),
      ...(runningData.data || []),
    ];

    // Sort by date
    allTrainings.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const events = allTrainings.map((t: any) => ({
      id: t.id,
      documentId: t.documentId,
      date: t.date,
      training: {
        id: t.trainingType === "swimming" ? 1 : 2, // Mock ID based on static list
        documentId: t.trainingType,
        title: t.trainingType === "swimming" ? "Schwimmen" : "Laufen",
      },
      location: {
        name: t.locationName,
        imageName: t.imageName,
      },
    }));

    return Response.json(events);
  } catch (error: any) {
    clearTimeout(mainTimeoutId);

    if (error.name === "AbortError") {
      console.error("Fetch to Strapi timed out after 10-15 seconds");
      return Response.json(
        {
          error:
            "Strapi connection timeout. Services may be temporarily slow. Please retry.",
        },
        { status: 504 },
      );
    }

    console.error("Error fetching events:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

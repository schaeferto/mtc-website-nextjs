export async function GET() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = process.env.STRAPI_API_TOKEN;

  const debug = {
    env: {
      strapiUrl: strapiUrl ? "✓ Set" : "✗ Missing",
      token: token ? "✓ Set" : "✗ Missing",
      url: strapiUrl,
    },
    tests: {} as Record<string, any>,
  };

  if (!strapiUrl) {
    return Response.json({
      ...debug,
      error: "NEXT_PUBLIC_STRAPI_API_URL not set",
    });
  }

  // Test 1: DNS/connectivity
  try {
    const start = Date.now();
    const response = await fetch(`${strapiUrl}/api/events`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    const time = Date.now() - start;
    const text = await response.text();

    debug.tests = {
      connectivity: {
        status: response.status,
        statusText: response.statusText,
        time: `${time}ms`,
        ok: response.ok,
        responsePreview: text.substring(0, 200),
      },
    };

    if (!response.ok) {
      debug.tests.connectivity.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    debug.tests = {
      connectivity: {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : "Unknown",
      },
    };
  }

  return Response.json(debug);
}

/**
 * Strapi API Client
 * Connects to the cloud-hosted Strapi instance
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Fetch data from Strapi API
 * @param path - The API endpoint path (e.g., '/api/events')
 * @param options - Fetch options
 * @returns The parsed JSON response
 */
export async function fetchFromStrapi<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error(
      "NEXT_PUBLIC_STRAPI_API_URL environment variable is not set",
    );
  }

  const url = `${STRAPI_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authentication token if provided
  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body,
      // Cache settings for ISR or on-demand revalidation
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi (${url}):`, error);
    throw error;
  }
}

/**
 * Test the connection to Strapi
 * @returns Connection status
 */
export async function testStrapiConnection(): Promise<{
  success: boolean;
  message: string;
  url?: string;
}> {
  try {
    if (!STRAPI_URL) {
      return {
        success: false,
        message: "NEXT_PUBLIC_STRAPI_API_URL is not configured",
      };
    }

    const response = await fetch(`${STRAPI_URL}/api/events`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    });

    if (response.ok) {
      return {
        success: true,
        message: "Successfully connected to Strapi",
        url: STRAPI_URL,
      };
    } else {
      return {
        success: false,
        message: `Connection failed: ${response.status} ${response.statusText}`,
        url: STRAPI_URL,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

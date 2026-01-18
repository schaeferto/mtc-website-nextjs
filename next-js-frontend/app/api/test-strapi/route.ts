import { testStrapiConnection } from "@/app/lib/strapi-client";

export async function GET() {
  const result = await testStrapiConnection();
  return Response.json(result);
}

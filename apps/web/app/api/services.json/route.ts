import { fetchChatbotEndpoint } from "../../../src/content/chatbot-routes";
import { readClient } from "../../../src/sanity";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const payload = await fetchChatbotEndpoint(readClient, "services");
  if (payload === null) {
    return Response.json({ error: "not_enabled" }, { status: 404 });
  }
  return Response.json(payload);
}

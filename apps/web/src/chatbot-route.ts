import { fetchChatbotEndpoint, isChatbotEndpoint } from "./content/chatbot-routes";
import { readClient } from "./sanity";

/**
 * DSN-105: beş chatbot route dosyasının ortak gövdesi — tek kaynak.
 * Dosyalar kalır çünkü URL kontratı .json uzantısı taşır ve Next'in dinamik
 * segment adı tam [endpoint] olmak zorundadır ([endpoint].json geçersiz).
 */
export async function chatbotEndpointResponse(endpoint: string): Promise<Response> {
  if (!isChatbotEndpoint(endpoint)) {
    return Response.json({ error: "not_enabled" }, { status: 404 });
  }
  const payload = await fetchChatbotEndpoint(readClient, endpoint);
  if (payload === null) {
    return Response.json({ error: "not_enabled" }, { status: 404 });
  }
  return Response.json(payload);
}

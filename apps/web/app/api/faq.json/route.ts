import { chatbotEndpointResponse } from "../../../src/chatbot-route";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return chatbotEndpointResponse("faq");
}

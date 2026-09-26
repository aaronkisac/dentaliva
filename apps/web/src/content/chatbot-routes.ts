import type { SanityClient } from "@sanity/client";

import {
  doctorListQuery,
  faqListQuery,
  treatmentListQuery,
} from "@dentaliva/sanity-schema/queries";

import type {
  ChatbotClinic,
  ChatbotDoctor,
  ChatbotFaq,
  ChatbotService,
  ChatbotServiceItem,
  SiteSettingsLite,
} from "./chatbot";
import type { DoctorItem, FaqEntry } from "./home";

import { getSite } from "../config";
import { toChatbotClinic, toChatbotDoctors, toChatbotFaq, toChatbotServices } from "./chatbot";

/** Demo slot data from the prototype contract (no live scheduling in v1). */
interface DemoSlot {
  date: string;
  times: string[];
}

const demoSlots: DemoSlot[] = [
  { date: "2026-09-28", times: ["09:30", "11:00", "14:30"] },
  { date: "2026-09-29", times: ["10:00", "13:30"] },
];

const endpoints = {
  clinic: async (client: SanityClient): Promise<ChatbotClinic> => {
    const settings = await client.fetch<SiteSettingsLite | null>(`*[_type == "siteSettings"][0]`);
    return toChatbotClinic(settings);
  },
  services: async (client: SanityClient): Promise<ChatbotService[]> => {
    const list = await client.fetch<Array<ChatbotServiceItem> | null>(treatmentListQuery);
    return toChatbotServices(list ?? []);
  },
  doctors: async (client: SanityClient): Promise<ChatbotDoctor[]> => {
    const list = await client.fetch<Array<DoctorItem> | null>(doctorListQuery);
    return toChatbotDoctors(list ?? []);
  },
  faq: async (client: SanityClient): Promise<ChatbotFaq[]> => {
    const list = await client.fetch<Array<FaqEntry> | null>(faqListQuery);
    return toChatbotFaq(list ?? []);
  },
  slots: (): Promise<DemoSlot[]> => Promise.resolve(demoSlots),
};

export type ChatbotEndpoint = keyof typeof endpoints;

export function isChatbotEndpoint(value: string): value is ChatbotEndpoint {
  return value in endpoints;
}

export async function fetchChatbotEndpoint(
  client: SanityClient,
  endpoint: string,
): Promise<ChatbotClinic | ChatbotService[] | ChatbotDoctor[] | ChatbotFaq[] | DemoSlot[] | null> {
  if (!isChatbotEndpoint(endpoint)) return null;
  if (!getSite().features.chatbotApi) return null;
  return endpoints[endpoint](client);
}

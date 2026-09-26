import type {
  DoctorItem,
  FaqEntry,
  LocalizedPair,
  QuickServiceItem,
  SiteSettingsLite,
} from "./home";

export type { SiteSettingsLite };

/** Shapes mirror the prototype chatbot contract (api/*.json + API.md). */

export interface ChatbotClinic {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  address: string;
}

export function toChatbotClinic(settings: SiteSettingsLite | null): ChatbotClinic {
  return {
    name: "Dentaliva",
    phone: settings?.phone ?? "",
    email: settings?.email ?? "",
    whatsapp: "",
    hours: "",
    address: "",
  };
}

export interface ChatbotService {
  id: string;
  name: LocalizedPair;
  description: LocalizedPair;
  duration_days: string | null;
  tags: string[];
}

export interface ChatbotServiceItem extends QuickServiceItem {
  durationDays?: string;
  tags?: string[];
}

export function toChatbotServices(items: ChatbotServiceItem[]): ChatbotService[] {
  return items.map((item) => ({
    id: item.slug ?? "",
    name: { tr: item.name?.tr?.trim() ?? "", en: item.name?.en?.trim() ?? "" },
    description: {
      tr: item.summary?.tr?.trim() ?? "",
      en: item.summary?.en?.trim() ?? "",
    },
    duration_days: item.durationDays ?? null,
    tags: item.tags ?? [],
  }));
}

export interface ChatbotDoctor {
  name: string;
  role: LocalizedPair;
  rating: number;
}

export function toChatbotDoctors(items: DoctorItem[]): ChatbotDoctor[] {
  return items.map((item) => ({
    name: item.name ?? "",
    role: { tr: item.title?.tr?.trim() ?? "", en: item.title?.en?.trim() ?? "" },
    rating: 5,
  }));
}

export interface ChatbotFaq {
  question: string;
  answer: string;
}

export function toChatbotFaq(items: FaqEntry[]): ChatbotFaq[] {
  return items.map((item) => ({
    question: item.question?.tr?.trim() ?? "",
    answer: item.answer?.tr?.trim() ?? "",
  }));
}

import { describe, expect, it, vi } from "vitest";

import {
  toChatbotClinic,
  toChatbotDoctors,
  toChatbotFaq,
  toChatbotServices,
} from "../src/content/chatbot";
import { fetchChatbotEndpoint } from "../src/content/chatbot-routes";
import type { ChatbotServiceItem } from "../src/content/chatbot";

describe("chatbot contract mappings (PGT-10)", () => {
  const serviceItem: ChatbotServiceItem = {
    name: { tr: "İmplant Tedavisi", en: "Dental Implants" },
    slug: "implant-tedavisi",
    summary: { tr: "Kalıcı çözüm.", en: "Lasting solution." },
    durationDays: "90-120",
    tags: ["all-on-four"],
  };

  it("maps treatments to the prototype service shape", () => {
    expect(toChatbotServices([serviceItem])).toEqual([
      {
        id: "implant-tedavisi",
        name: { tr: "İmplant Tedavisi", en: "Dental Implants" },
        description: { tr: "Kalıcı çözüm.", en: "Lasting solution." },
        duration_days: "90-120",
        tags: ["all-on-four"],
      },
    ]);
  });

  it("maps doctors with role and rating", () => {
    const [doctor] = toChatbotDoctors([
      { name: "Dt. Kadir Demir", title: { tr: "Diş Hekimi", en: "Dentist" } },
    ]);
    expect(doctor).toEqual({
      name: "Dt. Kadir Demir",
      role: { tr: "Diş Hekimi", en: "Dentist" },
      rating: 5,
    });
  });

  it("maps faq with trimmed tr content", () => {
    expect(toChatbotFaq([{ question: { tr: " Soru " }, answer: { tr: " Cevap " } }])).toEqual([
      { question: "Soru", answer: "Cevap" },
    ]);
  });

  it("maps clinic settings with fallbacks", () => {
    expect(
      toChatbotClinic({ phone: "+90 212 555 54 82", email: "info@dentaliva.com" }),
    ).toMatchObject({ name: "Dentaliva", phone: "+90 212 555 54 82", whatsapp: "" });
  });
});

describe("chatbot routes (PGT-10)", () => {
  it("serves known endpoints and ignores unknown ones", async () => {
    const client = { fetch: vi.fn().mockResolvedValue(null) };
    const slots = await fetchChatbotEndpoint(client as never, "slots");
    expect(Array.isArray(slots)).toBe(true);
    expect(await fetchChatbotEndpoint(client as never, "nope")).toBeNull();
  });
});

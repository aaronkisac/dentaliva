import { describe, expect, it } from "vitest";

import {
  toChatbotClinic,
  toChatbotDoctors,
  toChatbotFaq,
  toChatbotServices,
} from "../src/content/chatbot";

describe("chatbot mappings fill safe fallbacks for missing CMS fields", () => {
  it("clinic: null settings become empty strings", () => {
    expect(toChatbotClinic(null)).toEqual({
      name: "Dentaliva",
      phone: "",
      email: "",
      whatsapp: "",
      hours: "",
      address: "",
    });
  });

  it("services: missing slug/summary/tags fall back", () => {
    expect(toChatbotServices([{ name: { tr: " X " } }])).toEqual([
      {
        id: "",
        name: { tr: "X", en: "" },
        description: { tr: "", en: "" },
        duration_days: null,
        tags: [],
      },
    ]);
  });

  it("services: partial locale objects fall back per locale", () => {
    expect(toChatbotServices([{ name: {}, summary: { en: " Y " } }])).toEqual([
      {
        id: "",
        name: { tr: "", en: "" },
        description: { tr: "", en: "Y" },
        duration_days: null,
        tags: [],
      },
    ]);
  });

  it("doctors and faq: missing fields fall back to empty strings", () => {
    expect(toChatbotDoctors([{}])).toEqual([{ name: "", role: { tr: "", en: "" }, rating: 5 }]);
    expect(toChatbotFaq([{}])).toEqual([{ question: "", answer: "" }]);
  });
});

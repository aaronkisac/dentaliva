import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchChatbotEndpoint } from "../src/content/chatbot-routes";

const { getSiteMock, siteFixture } = vi.hoisted(() => {
  const fixture = {
    id: "test",
    domain: "www.dentaliva.com",
    locales: ["tr"],
    defaultLocale: "tr",
    sanity: { projectId: "p", dataset: "production", stagingDataset: "staging" },
    sisterDomains: [],
    features: { chatbotApi: true, blog: true },
    nav: [],
    sections: { home: [] },
  };
  return { getSiteMock: vi.fn(), siteFixture: fixture };
});

vi.mock("../src/config", () => ({ getSite: getSiteMock, site: siteFixture }));

function mockClient(responses: unknown[]) {
  let call = 0;
  return {
    fetch: vi.fn().mockImplementation(() => Promise.resolve(responses[call++] ?? null)),
  } as unknown as Parameters<typeof fetchChatbotEndpoint>[0];
}

describe("chatbot static endpoints (prototype contract)", () => {
  beforeEach(() => {
    getSiteMock.mockReturnValue(siteFixture);
  });

  it("returns null for an unknown endpoint", async () => {
    expect(await fetchChatbotEndpoint(mockClient([]), "nope")).toBeNull();
  });

  it("returns null when the chatbotApi feature is off", async () => {
    getSiteMock.mockReturnValueOnce({
      ...siteFixture,
      features: { ...siteFixture.features, chatbotApi: false },
    });
    expect(await fetchChatbotEndpoint(mockClient([]), "clinic")).toBeNull();
  });

  it("serves clinic from siteSettings", async () => {
    const result = await fetchChatbotEndpoint(mockClient([{ phone: "+90 212" }]), "clinic");
    expect(result).toMatchObject({ name: "Dentaliva", phone: "+90 212" });
  });

  it("serves services, doctors, faq and demo slots", async () => {
    const service = { name: { tr: "İmplant" }, slug: "implant", summary: { tr: "X" } };
    expect(await fetchChatbotEndpoint(mockClient([[service]]), "services")).toHaveLength(1);

    const doctor = { name: "Dt. Ayşe", title: { tr: "Periodontolog" } };
    expect(await fetchChatbotEndpoint(mockClient([[doctor]]), "doctors")).toHaveLength(1);

    const faq = { question: { tr: "Soru" }, answer: { tr: "Cevap" } };
    expect(await fetchChatbotEndpoint(mockClient([[faq]]), "faq")).toHaveLength(1);

    const slots = await fetchChatbotEndpoint(mockClient([]), "slots");
    expect(Array.isArray(slots)).toBe(true);
    expect(slots).not.toBeNull();
  });

  it("null CMS lists fall back to empty arrays", async () => {
    expect(await fetchChatbotEndpoint(mockClient([null]), "services")).toEqual([]);
    expect(await fetchChatbotEndpoint(mockClient([null]), "doctors")).toEqual([]);
    expect(await fetchChatbotEndpoint(mockClient([null]), "faq")).toEqual([]);
  });
});

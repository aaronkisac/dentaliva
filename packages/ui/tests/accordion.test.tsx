import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Accordion, type AccordionItem } from "../src/accordion";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

const items: AccordionItem[] = [
  {
    id: "whitening",
    question: "Which whitening methods exist?",
    answer: "Office and home bleaching.",
  },
  { id: "implant", question: "How long do implants take?", answer: "Usually 3 to 6 months." },
];

describe("Accordion", () => {
  it("opens the first item by default", () => {
    renderUi(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: items[0]?.question })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: items[1]?.question })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("shows the open panel and hides closed ones", () => {
    renderUi(<Accordion items={items} />);
    expect(screen.getByText(items[0]?.answer ?? "")).toBeVisible();
    expect(screen.getByText(items[1]?.answer ?? "")).not.toBeVisible();
  });

  it("toggles on click and enforces single-open", async () => {
    renderUi(<Accordion items={items} defaultOpenId={null} />);
    await userEvent.click(screen.getByRole("button", { name: items[0]?.question }));
    expect(screen.getByRole("button", { name: items[0]?.question })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: items[1]?.question }));
    expect(screen.getByRole("button", { name: items[1]?.question })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: items[0]?.question })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await userEvent.click(screen.getByRole("button", { name: items[1]?.question }));
    expect(screen.getByRole("button", { name: items[1]?.question })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("renders no buttons for an empty item list", () => {
    renderUi(<Accordion items={[]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("links panels to their headers with aria-controls and labelled-by", () => {
    renderUi(<Accordion items={items} defaultOpenId="implant" />);
    const button = screen.getByRole("button", { name: items[1]?.question });
    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId ?? "missing");
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("aria-labelledby", button.id);
  });

  it("works with the keyboard (Enter activates the header button)", async () => {
    renderUi(<Accordion items={items} defaultOpenId={null} />);
    const button = screen.getByRole("button", { name: items[0]?.question });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Accordion items={items} />);
  });
});

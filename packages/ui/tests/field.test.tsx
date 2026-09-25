import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Field } from "../src/field";
import { Input } from "../src/controls";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Field", () => {
  it("wires label, id and required to the control", () => {
    renderUi(
      <Field id="name" label="Ad Soyad" required>
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    const input = screen.getByLabelText(/Ad Soyad/);
    expect(input).toHaveAttribute("id", "name");
    expect(input).toHaveAttribute("required");
  });

  it("adds aria-invalid and describedby only when an error exists", () => {
    const { rerender } = renderUi(
      <Field id="phone" label="Telefon">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    const input = screen.getByLabelText("Telefon");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");

    rerender(
      <Field id="phone" label="Telefon" error="Geçerli bir telefon girin">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    const invalid = screen.getByLabelText("Telefon");
    expect(invalid).toHaveAttribute("aria-invalid", "true");
    expect(invalid).toHaveAttribute("aria-describedby", "phone-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Geçerli bir telefon girin");
  });

  it("includes the hint id before the error id in describedby", () => {
    renderUi(
      <Field id="kvkk" label="KVKK" hint="Aydınlatma metnini okuyun" error="Onay gerekli">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    expect(screen.getByLabelText("KVKK")).toHaveAttribute(
      "aria-describedby",
      "kvkk-hint kvkk-error",
    );
  });

  it("hides the required marker from assistive tech", () => {
    renderUi(
      <Field id="name" label="Ad Soyad" required>
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
  });

  it("supports typing through the rendered control", async () => {
    renderUi(
      <Field id="name" label="Ad Soyad">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
    await userEvent.type(screen.getByLabelText(/Ad Soyad/), "Aaron");
    expect(screen.getByLabelText(/Ad Soyad/)).toHaveValue("Aaron");
  });

  it("has no axe violations without error", async () => {
    await expectNoA11yViolations(
      <Field id="name" label="Ad Soyad" required>
        {(aria) => <Input {...aria} />}
      </Field>,
    );
  });

  it("has no axe violations with hint and error present", async () => {
    await expectNoA11yViolations(
      <Field id="phone" label="Telefon" hint="Ör: 0532 000 00 00" error="Zorunlu alan">
        {(aria) => <Input {...aria} />}
      </Field>,
    );
  });
});

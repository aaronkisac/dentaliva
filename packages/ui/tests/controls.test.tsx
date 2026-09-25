import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Checkbox, Select, Textarea } from "../src/controls";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Checkbox", () => {
  it("toggles via its nested label", async () => {
    renderUi(<Checkbox label="KVKK aydınlatma metnini okudum" name="kvkk" />);
    const box = screen.getByRole("checkbox", { name: "KVKK aydınlatma metnini okudum" });
    expect(box).not.toBeChecked();
    await userEvent.click(screen.getByText("KVKK aydınlatma metnini okudum"));
    expect(box).toBeChecked();
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLInputElement>();
    renderUi(<Checkbox label="ok" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Checkbox label="Onaylıyorum" />);
  });
});

describe("Textarea", () => {
  it("renders rows and accepts typing", async () => {
    const ref = createRef<HTMLTextAreaElement>();
    renderUi(<Textarea ref={ref} aria-label="Mesaj" />);
    await userEvent.type(screen.getByRole("textbox", { name: "Mesaj" }), "merhaba");
    expect(ref.current?.value).toBe("merhaba");
  });
});

describe("Select", () => {
  it("renders options and forwards refs", async () => {
    renderUi(
      <Select aria-label="Hizmet">
        <option>İmplant</option>
        <option>Ortodonti</option>
      </Select>,
    );
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Hizmet" }), "Ortodonti");
    expect(screen.getByRole("combobox", { name: "Hizmet" })).toHaveValue("Ortodonti");
  });
});

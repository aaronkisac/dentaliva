import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../src/button";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Button", () => {
  it("renders its label as type=button by default", () => {
    renderUi(<Button>Book now</Button>);
    const button = screen.getByRole("button", { name: "Book now" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("defaults to the gold variant and supports the other variants", () => {
    const { rerender } = renderUi(<Button>go</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gold");
    rerender(<Button variant="navy">go</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-navy");
    rerender(<Button variant="outline">go</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-gold");
    rerender(<Button variant="ghostLight">go</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-white");
  });

  it("applies size variants", () => {
    renderUi(<Button size="lg">go</Button>);
    expect(screen.getByRole("button", { name: "go" })).toHaveClass("px-8");
  });

  it("keeps a keyboard focus-visible ring class", () => {
    renderUi(<Button>focus</Button>);
    expect(screen.getByRole("button")).toHaveClass("focus-visible:outline-gold");
  });

  it("forwards clicks and refs", async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    renderUi(
      <Button ref={ref} onClick={onClick}>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    renderUi(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps an explicit type over the default", () => {
    renderUi(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Button>Accessible</Button>);
  });
});

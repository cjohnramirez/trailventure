import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GuestStepper, MAX_GUESTS } from "./guest-stepper";

describe("GuestStepper", () => {
  it("counts travelers up and down", async () => {
    const onChange = vi.fn();
    render(<GuestStepper value={2} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Add a traveler" }));
    expect(onChange).toHaveBeenCalledWith(3);

    await userEvent.click(screen.getByRole("button", { name: "Remove a traveler" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("stops at one person", () => {
    render(<GuestStepper value={1} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove a traveler" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("1 person");
  });

  it("stops at the group limit", () => {
    render(<GuestStepper value={MAX_GUESTS} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Add a traveler" })).toBeDisabled();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders an accessible button", () => {
    render(<Button>Find My Trailventure</Button>);
    expect(screen.getByRole("button", { name: "Find My Trailventure" })).toBeEnabled();
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/search">Search</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Search" })).toHaveAttribute("href", "/search");
  });
});

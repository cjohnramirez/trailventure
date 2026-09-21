import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("joins conditional classes", () => {
    expect(cn("px-4", false && "hidden", "py-2")).toBe("px-4 py-2");
  });

  it("lets later Tailwind classes win over conflicting earlier ones", () => {
    expect(cn("px-4 text-sm", "px-8")).toBe("text-sm px-8");
  });
});

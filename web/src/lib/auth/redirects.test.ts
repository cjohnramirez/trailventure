import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirects";

describe("safeNextPath", () => {
  it("keeps relative paths", () => {
    expect(safeNextPath("/account?tab=bookings")).toBe("/account?tab=bookings");
  });

  it.each([null, undefined, "", "https://evil.example", "//evil.example", "/\\evil.example"])(
    "falls back for %s",
    (value) => {
      expect(safeNextPath(value)).toBe("/");
    },
  );
});

import { describe, expect, it } from "vitest";

import { formatDateRange, formatPeso, toIsoDate } from "./format";

describe("formatPeso", () => {
  it("adds the peso sign and thousands separators", () => {
    expect(formatPeso(12000)).toBe("₱12,000");
  });

  it("rounds to whole pesos", () => {
    expect(formatPeso(8499.6)).toBe("₱8,500");
  });
});

describe("toIsoDate", () => {
  it("uses the local calendar date, not UTC", () => {
    // Midnight local time must not roll back a day (the legacy app's toISOString bug in UTC+8).
    expect(toIsoDate(new Date(2026, 9, 4, 0, 0))).toBe("2026-10-04");
  });
});

describe("formatDateRange", () => {
  it("returns null without a start date", () => {
    expect(formatDateRange()).toBeNull();
  });

  it("formats a single day and a range", () => {
    expect(formatDateRange(new Date(2026, 9, 1))).toBe("Oct 1");
    expect(formatDateRange(new Date(2026, 9, 1), new Date(2026, 9, 10))).toBe("Oct 1 – Oct 10");
  });
});

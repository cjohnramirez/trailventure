import { describe, expect, it } from "vitest";

import { formatCentavos, formatDateRange, formatPeso, formatTime, toIsoDate } from "./format";

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

describe("formatCentavos", () => {
  it("converts API centavos to pesos", () => {
    expect(formatCentavos(12_000_00)).toBe("₱12,000");
  });
});

describe("formatTime", () => {
  it.each([
    ["08:00:00", "8:00 AM"],
    ["13:30:00", "1:30 PM"],
    ["00:05:00", "12:05 AM"],
    ["12:00:00", "12:00 PM"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatTime(input)).toBe(expected);
  });

  it("returns null without a time", () => {
    expect(formatTime(null)).toBeNull();
  });
});

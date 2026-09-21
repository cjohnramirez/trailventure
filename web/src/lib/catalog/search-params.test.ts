import { describe, expect, it } from "vitest";

import { hasActiveFilters, parseSearchFilters, toSearchQuery } from "./search-params";

describe("parseSearchFilters", () => {
  it("keeps valid filters", () => {
    expect(
      parseSearchFilters({
        destination: "siargao",
        start: "2026-10-01",
        end: "2026-10-10",
        min_price: "5000",
        max_price: "20000",
        rating: "4",
        page: "2",
      }),
    ).toEqual({
      destination: "siargao",
      start: "2026-10-01",
      end: "2026-10-10",
      min_price: 5000,
      max_price: 20000,
      rating: 4,
      page: 2,
    });
  });

  it("drops malformed values instead of failing", () => {
    expect(
      parseSearchFilters({
        destination: "<script>",
        start: "10/01/2026",
        min_price: "-5",
        rating: "9",
        page: "0",
      }),
    ).toEqual({});
  });

  it("uses the first value of repeated params", () => {
    expect(parseSearchFilters({ destination: ["banaue", "siargao"] }).destination).toBe("banaue");
  });
});

describe("toSearchQuery", () => {
  it("omits empty values and the first page", () => {
    expect(toSearchQuery({ destination: "banaue", page: 1, rating: undefined })).toBe(
      "destination=banaue",
    );
  });
});

describe("hasActiveFilters", () => {
  it("ignores pagination", () => {
    expect(hasActiveFilters({ page: 3 })).toBe(false);
    expect(hasActiveFilters({ rating: 5 })).toBe(true);
  });
});

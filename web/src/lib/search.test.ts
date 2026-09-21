import { describe, expect, it } from "vitest";

import { PRICE_MAX, buildSearchHref } from "./search";

describe("buildSearchHref", () => {
  it("links to plain /search when nothing is set", () => {
    expect(buildSearchHref({})).toBe("/search");
  });

  it("includes only the filters that are set", () => {
    expect(
      buildSearchHref({
        destination: "siargao",
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 10),
        minPrice: 5000,
        maxPrice: 20000,
      }),
    ).toBe(
      "/search?destination=siargao&start=2026-10-01&end=2026-10-10&min_price=5000&max_price=20000",
    );
  });

  it("treats the slider's upper bound as no maximum", () => {
    expect(buildSearchHref({ minPrice: 0, maxPrice: PRICE_MAX })).toBe("/search");
  });
});

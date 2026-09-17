import { describe, expect, it } from "vitest";

import { cloudinaryLoader, isCloudinary } from "./catalog-image";

const SIARGAO =
  "https://res.cloudinary.com/demo/image/upload/trailventure/catalog/destinations/siargao";

describe("cloudinaryLoader", () => {
  it("inserts format, quality and width transformations", () => {
    expect(cloudinaryLoader({ src: SIARGAO, width: 800 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_limit/trailventure/catalog/destinations/siargao",
    );
    expect(cloudinaryLoader({ src: SIARGAO, width: 400, quality: 70 })).toContain("q_70,w_400");
  });

  it("leaves other URLs untouched", () => {
    expect(cloudinaryLoader({ src: "/static/catalog/seed/x.webp", width: 800 })).toBe(
      "/static/catalog/seed/x.webp",
    );
  });
});

describe("isCloudinary", () => {
  it("only matches Cloudinary delivery URLs", () => {
    expect(isCloudinary(SIARGAO)).toBe(true);
    expect(isCloudinary("/images/site/auth.webp")).toBe(false);
  });
});

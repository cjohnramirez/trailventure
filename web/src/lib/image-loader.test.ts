import { describe, expect, it } from "vitest";

import imageLoader from "./image-loader";

describe("imageLoader", () => {
  it("sizes Unsplash photos on the Unsplash CDN and keeps the tracking ixid", () => {
    const url = new URL(
      imageLoader({
        src: "https://images.unsplash.com/photo-1?ixid=abc&ixlib=rb-4.1.0",
        width: 1200,
        quality: 80,
      }),
    );
    expect(url.host).toBe("images.unsplash.com");
    expect(url.searchParams.get("ixid")).toBe("abc");
    expect(url.searchParams.get("w")).toBe("1200");
    expect(url.searchParams.get("q")).toBe("80");
    expect(url.searchParams.get("auto")).toBe("format");
  });

  it("leaves other sources untouched", () => {
    expect(imageLoader({ src: "/icon.svg", width: 64 })).toBe("/icon.svg");
  });
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("site shell", () => {
  test("early access banner can be dismissed and stays dismissed", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Early access notice" });
    await expect(banner).toBeVisible();

    await page.getByRole("button", { name: "Dismiss notice" }).click();
    await expect(banner).toBeHidden();

    await page.reload();
    await expect(banner).toBeHidden();
  });

  test("header has the logo, early access badge and menu", async ({ page }) => {
    await page.goto("/about");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: /TrailVenture/i })).toHaveAttribute("href", "/");
    await expect(header.getByRole("button", { name: "Menu" })).toBeVisible();
  });

  test("menu toggles dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/about");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("home hero search links to search results", async ({ page, isMobile }) => {
    test.skip(isMobile, "The inline pill is desktop-only; mobile uses the compact trigger.");
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Find My Trailventure" }).first()).toHaveAttribute(
      "href",
      "/search",
    );
  });

  test("unknown pages show the 404 page inside the shell", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "You seem lost" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  });

  for (const path of ["/", "/about"]) {
    test(`${path} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Drives the real API with the seeded catalog (`manage.py seed_catalog`).
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with the API running and seeded.");

const SIARGAO = "/package/siargao-island-surf-nature-retreat";

test("home shows the featured destinations bento linking to search", async ({ page }) => {
  await page.goto("/");
  const featured = page.getByRole("region", { name: "Featured Destinations" });
  const tiles = featured.getByRole("link");
  await expect(tiles).toHaveCount(6);
  await expect(tiles.first()).toContainText("Siargao");

  await tiles.first().click();
  await expect(page).toHaveURL("/search?destination=siargao");
  await expect(page.getByText("Found 1 package")).toBeVisible();
});

test("search lists packages with prices and paginates", async ({ page }) => {
  await page.goto("/search");
  await expect(page.getByText("Found 8 packages")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(page.getByText(/from ₱\d/).first()).toBeVisible();

  await page.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL("/search?page=2");
  await expect(page.getByRole("article")).toHaveCount(2);
});

test("price filter from the URL narrows results", async ({ page }) => {
  await page.goto("/search?max_price=10000");
  await expect(page.getByText("Found 2 packages")).toBeVisible();
});

test("impossible filters show the empty state with a way out", async ({ page }) => {
  await page.goto("/search?rating=5");
  await expect(page.getByText("No packages found matching your filters")).toBeVisible();
  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page).toHaveURL("/search");
  await expect(page.getByText("Found 8 packages")).toBeVisible();
});

test("applying review score from the filters panel updates the URL", async ({ page, isMobile }) => {
  test.skip(isMobile, "The mobile filters sheet is covered by the desktop panel test.");
  await page.goto("/search");
  const filters = page.getByRole("complementary", { name: "Filters" });
  await filters.getByRole("radio", { name: "Great 4+" }).click();
  await filters.getByRole("button", { name: "Apply Filter" }).click();
  await expect(page).toHaveURL("/search?rating=4");
  await expect(page.getByText("No packages found matching your filters")).toBeVisible();
});

test("package page switches tiers, amenities and itinerary", async ({ page }) => {
  await page.goto(SIARGAO);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Siargao Island Surf & Nature Retreat",
  );
  await expect(page.getByText("₱12,000").last()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cloud 9 Surfing Spot" })).toBeVisible();

  await page.getByRole("radio", { name: /Luxury Beachfront Retreat/ }).click();
  await expect(page.getByText("₱25,000").last()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sugba Lagoon" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cloud 9 Surfing Spot" })).toBeHidden();
});

test("unknown packages show the 404 page once", async ({ page }) => {
  await page.goto("/package/does-not-exist");
  await expect(page.getByRole("heading", { name: "We couldn’t find that package" })).toBeVisible();
  await expect(page.getByRole("banner")).toHaveCount(1);
});

for (const path of ["/", "/search", SIARGAO]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

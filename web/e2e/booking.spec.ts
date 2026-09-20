import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { loginAsDemoTraveler } from "./support/session";

// Drives the real API with the seeded catalog and demo users.
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with the API running and seeded.");
test.describe.configure({ mode: "serial" });

const PACKAGE = "/package/siargao-island-surf-nature-retreat";

/** Picks the first selectable day in the open date popover. */
async function pickFirstAvailableDate(page: import("@playwright/test").Page) {
  const day = page.locator("button[data-day]:not([disabled])").first();
  await day.click();
}

test("logged-out visitors are sent to login before the booking page", async ({ page }) => {
  await page.goto("/booking/siargao-island-surf-nature-retreat");
  await expect(page).toHaveURL(/\/login\?next=%2Fbooking%2F/);
});

test("the booking card quotes the server price and carries it to the booking page", async ({
  page,
}) => {
  await loginAsDemoTraveler(page);
  await page.goto(PACKAGE);

  const card = page.getByRole("button", { name: "Book Now" });
  await expect(card).toBeVisible();

  await page.getByRole("button", { name: "Select tour date" }).click();
  await pickFirstAvailableDate(page);
  // Picking a day closes the popover and shows the date on the trigger.
  await expect(page.locator("button[data-day]")).toHaveCount(0);
  await expect(page.locator("button#booking-date")).not.toHaveText("Choose your date");

  await page.getByRole("button", { name: "Add a traveler" }).click();
  await expect(page.getByRole("status", { name: "Travelers" })).toHaveText("3 people");

  await card.click();
  await expect(page).toHaveURL(/\/booking\/siargao-island-surf-nature-retreat\?tier=\d+&guests=3/);
  await expect(page.getByRole("heading", { name: "Review your booking" })).toBeVisible();

  const invoice = page.getByRole("complementary", { name: "Invoice" });
  await expect(invoice).toContainText("Total price");
  await expect(invoice).toContainText("× 3");
});

test("the booking page keeps the invoice in step with the configuration", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto(PACKAGE);
  await page.getByRole("button", { name: "Select tour date" }).click();
  await pickFirstAvailableDate(page);
  await page.getByRole("button", { name: "Book Now" }).click();

  const invoice = page.getByRole("complementary", { name: "Invoice" });
  await expect(invoice).toContainText("× 2");
  const before = await invoice.textContent();

  await page.getByRole("button", { name: "Add a traveler" }).click();
  await expect(invoice).toContainText("× 3");
  await expect(invoice).not.toHaveText(before!);
});

test("the booking page has no serious accessibility violations", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto(PACKAGE);
  await page.getByRole("button", { name: "Select tour date" }).click();
  await pickFirstAvailableDate(page);
  await page.getByRole("button", { name: "Book Now" }).click();
  await expect(page.getByRole("heading", { name: "Review your booking" })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { loginAsDemoTraveler } from "./support/session";

// Drives the real API with the seeded catalog and demo users.
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with the API running and seeded.");
test.describe.configure({ mode: "serial" });

const PACKAGE = "/package/siargao-island-surf-nature-retreat";

/** Below `lg` the booking controls live in a drawer behind the bottom bar. */
async function openBookingControls(page: Page) {
  const trigger = page.locator('[data-slot="drawer-trigger"]');
  if (await trigger.isVisible()) await trigger.click();
}

async function chooseFirstAvailableDate(page: Page) {
  await page.getByRole("button", { name: "Select tour date" }).click();
  await page.locator("button[data-day]:not([disabled])").first().click();
  // Picking a day closes the popover and shows the date on the trigger.
  await expect(page.locator("button[data-day]")).toHaveCount(0);
}

async function startBooking(page: Page) {
  await page.goto(PACKAGE);
  await openBookingControls(page);
  await chooseFirstAvailableDate(page);
  await page.getByRole("button", { name: "Book Now" }).last().click();
  await expect(page.getByRole("heading", { name: "Review your booking" })).toBeVisible();
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
  await openBookingControls(page);
  await chooseFirstAvailableDate(page);

  await page.getByRole("button", { name: "Add a traveler" }).click();
  await expect(page.getByRole("status", { name: "Travelers" })).toHaveText("3 people");

  await page.getByRole("button", { name: "Book Now" }).last().click();
  await expect(page).toHaveURL(/\/booking\/siargao-island-surf-nature-retreat\?tier=\d+&guests=3/);
  await expect(page.getByRole("heading", { name: "Review your booking" })).toBeVisible();

  const invoice = page.getByRole("complementary", { name: "Invoice" });
  await expect(invoice).toContainText("Total price");
  await expect(invoice).toContainText("× 3");
});

test("the booking page keeps the invoice in step with the configuration", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await startBooking(page);

  const invoice = page.getByRole("complementary", { name: "Invoice" });
  await expect(invoice).toContainText("× 2");
  const before = await invoice.textContent();

  await page.getByRole("button", { name: "Add a traveler" }).click();
  await expect(invoice).toContainText("× 3");
  await expect(invoice).not.toHaveText(before!);
});

test("the booking page has no serious accessibility violations", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await startBooking(page);

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

test("the package page has no serious accessibility violations with the booking drawer open", async ({
  page,
}) => {
  await loginAsDemoTraveler(page);
  await page.goto(PACKAGE);
  await openBookingControls(page);

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { loginAsDemoTraveler } from "./support/session";

// Drives the real API with the seeded demo users.
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with the API running and seeded.");
test.describe.configure({ mode: "serial" });

test("logged-out visitors are sent to login", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL("/login?next=%2Faccount");
});

test("the account page shows the profile, bookings and reviews", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto("/account");

  await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
  await expect(page.getByText("Customer Profile")).toBeVisible();
  await expect(page.getByRole("heading", { name: "User Details" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Bookings" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Reviews" })).toBeVisible();
  await expect(page.getByText("traveler@trailventure.local")).toBeVisible();
});

test("the profile can be edited and the change sticks", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto("/account");

  await page.getByRole("button", { name: "Edit profile" }).click();
  const phone = `+63 917 ${Date.now().toString().slice(-7)}`;
  await page.getByLabel("Phone").fill(phone);
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Profile updated.")).toBeVisible();
  await expect(page.getByText(phone)).toBeVisible();

  await page.reload();
  await expect(page.getByText(phone)).toBeVisible();
});

test("the profile form rejects a malformed social link", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto("/account");

  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByLabel("Instagram").fill("not-a-url");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Enter a full URL, starting with https://")).toBeVisible();
});

test("the account page has no serious accessibility violations", async ({ page }) => {
  await loginAsDemoTraveler(page);
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "User Details" })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
  ).toEqual([]);
});

test("reviewing is not offered to visitors who haven't taken the trip", async ({ page }) => {
  await page.goto("/package/siargao-island-surf-nature-retreat");
  const reviews = page.locator("#reviews");
  await expect(reviews).toContainText("No reviews yet");
  await expect(reviews.getByRole("button", { name: "Add Comment" })).toHaveCount(0);
});

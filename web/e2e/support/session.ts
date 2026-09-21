import { expect, type Page } from "@playwright/test";

export const DEMO_TRAVELER = {
  email: "traveler@trailventure.local",
  password: "trailventure-demo",
};

/** Signs in through the real login form (`manage.py seed_demo_users`). */
export async function loginAsDemoTraveler(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(DEMO_TRAVELER.email);
  await page.getByLabel("Password").fill(DEMO_TRAVELER.password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText("Welcome back!")).toBeVisible();
}

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { readCodeFromEmail, uniqueEmail } from "./support/mailpit";

// These tests drive the real Django API and read emails from Mailpit.
test.skip(!process.env.E2E_FULL_STACK, "Set E2E_FULL_STACK=1 with the API and Mailpit running.");
test.describe.configure({ mode: "serial" });

const PASSWORD = "trail-password-2026";

async function register(page: Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("First name").fill("Maria");
  await page.getByLabel("Last name").fill("Santos");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirm password").fill(PASSWORD);
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/verify-email/);
}

test("register, verify with the emailed code, see the account, log out and back in", async ({
  page,
  request,
  isMobile,
}) => {
  const email = uniqueEmail("register");
  await register(page, email);

  const code = await readCodeFromEmail(request, email, "Confirm your email");
  await page.getByLabel("Verification code").pressSequentially(code);
  await expect(page).toHaveURL("/");

  if (!isMobile) {
    await expect(page.getByRole("link", { name: /Welcome, Maria/ })).toBeVisible();
  }

  await page.goto("/account");
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.getByText("Santos")).toBeVisible();

  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect(page.getByText("You’re logged out.")).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Welcome back!")).toBeVisible();
});

test("login shows validation and credential errors", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();

  await page.getByLabel("Email").fill(uniqueEmail("nobody"));
  await page.getByLabel("Password").fill("definitely-wrong-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText(/not correct/i)).toBeVisible();
});

test("forgot password sends a code that resets the password", async ({ page, request }) => {
  const email = uniqueEmail("reset");
  await register(page, email);
  const code = await readCodeFromEmail(request, email, "Confirm your email");
  await page.getByLabel("Verification code").pressSequentially(code);
  await expect(page).toHaveURL("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await expect(page.getByText("You’re logged out.")).toBeVisible();

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send reset code" }).click();
  await expect(page).toHaveURL("/reset-password");

  const resetCode = await readCodeFromEmail(request, email, "password reset code");
  await page.getByLabel("Reset code").pressSequentially(resetCode);
  await page.getByLabel("New password", { exact: true }).fill("another-trail-password");
  await page.getByLabel("Confirm new password").fill("another-trail-password");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText(/Password updated/)).toBeVisible();
});

test("private pages send logged-out visitors to login and back", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL("/login?next=%2Faccount");
});

test("logged-out pages make no 401 requests", async ({ page }) => {
  const unauthorized: string[] = [];
  page.on("response", (response) => {
    if (response.status() === 401) unauthorized.push(response.url());
  });
  await page.goto("/");
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  expect(unauthorized).toEqual([]);
});

for (const path of ["/login", "/register", "/forgot-password"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

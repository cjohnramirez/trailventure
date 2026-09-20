import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The result pages read the booking in the browser, so they can be driven with mocked responses.
 * The proxy only checks that a session cookie exists; Django enforces the real ownership rules.
 */

const BOOKING_ID = "11111111-2222-3333-4444-555555555555";

const USER = {
  id: 1,
  email: "tala@example.com",
  first_name: "Tala",
  last_name: "Reyes",
  display_name: "Tala",
  role: "traveler",
  email_verified: true,
};

function booking(overrides: Record<string, unknown> = {}) {
  return {
    id: BOOKING_ID,
    status: "confirmed",
    package: {
      slug: "siargao-island-surf-nature-retreat",
      name: "Siargao Island Surf & Nature Retreat",
      address: "General Luna, Siargao Island, Philippines",
      cover: null,
    },
    tier: { id: 1, name: "Budget Surfers Delight" },
    start_date: "2026-10-01",
    guests: 2,
    unit_price: 1_200_000,
    base_amount: 2_400_000,
    site_fee_amount: 480_000,
    tax_amount: 288_000,
    total_amount: 3_168_000,
    tax_percent: "12.00",
    site_fee_percent: "20.00",
    hold_expires_at: new Date(Date.now() + 25 * 60_000).toISOString(),
    is_hold_active: true,
    confirmed_at: "2026-09-20T10:00:00Z",
    created_at: "2026-09-20T09:40:00Z",
    ...overrides,
  };
}

async function signedIn(page: Page) {
  await page
    .context()
    .addCookies([{ name: "sessionid", value: "e2e-session", url: "http://localhost:3000" }]);
  await page.route("**/api/v1/auth/me/", (route) => route.fulfill({ json: { user: USER } }));
}

async function serveBooking(page: Page, ...responses: Array<Record<string, unknown> | number>) {
  let call = 0;
  await page.route(`**/api/v1/bookings/${BOOKING_ID}/`, (route) => {
    const response = responses[Math.min(call++, responses.length - 1)];
    if (typeof response === "number") {
      return route.fulfill({ status: response, json: { detail: "Not found." } });
    }
    return route.fulfill({ json: response });
  });
}

test.beforeEach(async ({ page }) => {
  await signedIn(page);
});

test("a confirmed booking shows the transaction details", async ({ page }) => {
  await serveBooking(page, booking());
  await page.goto(`/booking/success/${BOOKING_ID}`);

  await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
  await expect(page.getByText(BOOKING_ID)).toBeVisible();
  await expect(page.getByText("₱31,680")).toBeVisible();
  await expect(page.getByText("Oct 1, 2026 · 2 people")).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to Home" })).toBeVisible();
});

test("an unconfirmed booking waits for the webhook and then confirms", async ({ page }) => {
  await serveBooking(page, booking({ status: "pending_payment", confirmed_at: null }), booking());
  await page.goto(`/booking/success/${BOOKING_ID}`);

  await expect(page.getByRole("heading", { name: "Confirming your payment" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
});

test("a booking that is not yours explains itself instead of failing", async ({ page }) => {
  await serveBooking(page, 404);
  await page.goto(`/booking/success/${BOOKING_ID}`);

  await expect(page.getByRole("heading", { name: "We couldn’t find this booking" })).toBeVisible();
});

test("the result page shows a skeleton while the booking loads", async ({ page }) => {
  await page.route(`**/api/v1/bookings/${BOOKING_ID}/`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_500));
    await route.fulfill({ json: booking() });
  });

  await page.goto(`/booking/success/${BOOKING_ID}`);
  await expect(page.getByRole("status", { name: "Loading your booking" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Booking Successful!" })).toBeVisible();
});

test("a cancelled payment can be retried while the hold is alive", async ({ page }) => {
  await serveBooking(page, booking({ status: "pending_payment", confirmed_at: null }));
  await page.goto(`/booking/cancelled/${BOOKING_ID}`);

  await expect(page.getByRole("heading", { name: "Payment cancelled" })).toBeVisible();
  await expect(page.getByText(/held for \d+ more minutes/)).toBeVisible();

  await page.route("**/api/v1/bookings/*/checkout/", (route) =>
    route.fulfill({ status: 503, json: { detail: "Payments are not available right now." } }),
  );
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Payments are not available right now.")).toBeVisible();
});

test("an expired hold offers a fresh booking instead of a retry", async ({ page }) => {
  await serveBooking(
    page,
    booking({
      status: "expired",
      confirmed_at: null,
      is_hold_active: false,
      hold_expires_at: new Date(Date.now() - 60_000).toISOString(),
    }),
  );
  await page.goto(`/booking/cancelled/${BOOKING_ID}`);

  await expect(page.getByRole("button", { name: "Try again" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Book this trip again" })).toBeVisible();
});

for (const [name, path] of [
  ["success", `/booking/success/${BOOKING_ID}`],
  ["cancelled", `/booking/cancelled/${BOOKING_ID}`],
] as const) {
  test(`the ${name} page has no serious accessibility violations`, async ({ page }) => {
    await serveBooking(page, booking(name === "success" ? {} : { status: "pending_payment" }));
    await page.goto(path);
    await expect(page.getByRole("heading").first()).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((v) => v.impact === "serious" || v.impact === "critical"),
    ).toEqual([]);
  });
}

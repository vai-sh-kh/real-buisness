import { test, expect, type Page } from "@playwright/test";

const LOGIN_URL = "/admin/login";

function emailInput(page: Page) {
  return page.getByRole("textbox", { name: /email/i });
}
function passwordInput(page: Page) {
  return page.getByPlaceholder("••••••••");
}

test.describe("Admin Login E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
    // Wait for form to be visible (page is client-rendered, may have redirect)
    await emailInput(page).waitFor({ state: "visible", timeout: 10_000 });
  });

  test("shows validation when submitting without entering credentials", async ({ page }) => {
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/please enter your email/i)).toBeVisible();
    await expect(page.getByText(/please enter your password/i)).toBeVisible();

    await expect(page).toHaveURL(new RegExp(LOGIN_URL));
  });

  test("shows validation for invalid email format", async ({ page }) => {
    await emailInput(page).fill("not-an-email");
    await passwordInput(page).fill("validpass123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(LOGIN_URL));
  });

  test("shows validation when password is too short", async ({ page }) => {
    await emailInput(page).fill("admin@example.com");
    await passwordInput(page).fill("12345");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/please use at least 6 characters for password/i)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(LOGIN_URL));
  });

  test("shows error and stays on login when credentials are wrong", async ({ page }) => {
    await emailInput(page).fill("wrong@example.com");
    await passwordInput(page).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByText(/please check your email and password/i)).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(new RegExp(LOGIN_URL));
  });

  test("logs in with correct credentials and redirects to dashboard", async ({ page }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD must be set (e.g. in .env.local) for this test");
    if (!adminEmail || !adminPassword) return;

    await emailInput(page).fill(adminEmail);
    await passwordInput(page).fill(adminPassword);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
    // Toast may disappear quickly; dashboard URL confirms success
  });

  test("redirect respects redirect param after successful login", async ({ page }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD must be set for this test");
    if (!adminEmail || !adminPassword) return;

    await page.goto(`${LOGIN_URL}?redirect=/admin/leads`);
    await emailInput(page).waitFor({ state: "visible", timeout: 10_000 });

    await emailInput(page).fill(adminEmail);
    await passwordInput(page).fill(adminPassword);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin\/leads/, { timeout: 15_000 });
  });

  test("has back to site link", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to site/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });
});

import { defineConfig, devices } from "@playwright/test";

// Load .env.local so E2E tests can use ADMIN_EMAIL / ADMIN_PASSWORD for login success test
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

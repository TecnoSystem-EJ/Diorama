import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 180_000,
  expect: { timeout: 15_000 },
  workers: 1,
  use: {
    baseURL: process.env.E2E_WEB_URL ?? "http://localhost:3000",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...(process.env.E2E_BROWSER_WS_URL ? { connectOptions: { wsEndpoint: process.env.E2E_BROWSER_WS_URL } } : {}),
  },
});

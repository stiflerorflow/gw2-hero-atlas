import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:5173/gw2-hero-atlas/wow-ah/",
    launchOptions: {
      executablePath: process.env.CI
        ? undefined
        : process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173/gw2-hero-atlas/wow-ah/",
    reuseExistingServer: !process.env.CI,
  },
});

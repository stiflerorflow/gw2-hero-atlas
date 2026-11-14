import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/gw2-hero-atlas/wow-ah/",
  build: { outDir: "dist" },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});

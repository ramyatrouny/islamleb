/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/hooks/**", "src/components/**"],
      exclude: [
        "src/**/*.d.ts",
        "src/lib/adhkar-data.ts",
        "src/lib/hadith-data.ts",
        "src/lib/types.ts",
        "src/lib/api/types.ts",
        "src/lib/error-messages.ts",
        "src/components/ui/**",
        "src/components/decorative-background.tsx",
        "src/components/community/**",
      ],
    },
  },
});

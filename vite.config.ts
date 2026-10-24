import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Keep the existing REACT_APP_* names in .env working.
  envPrefix: "REACT_APP_",
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
  },
});

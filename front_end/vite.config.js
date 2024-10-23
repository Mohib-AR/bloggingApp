import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server:
    command === "serve"
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:3000",
              secure: false,
            },
          },
        }
      : {},
  build: {
    outDir: "dist", 
  },
  plugins: [react()],
});

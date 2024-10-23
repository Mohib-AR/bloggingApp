import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
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
      outDir: "dist", // Ensure that the build output is directed to the "dist" folder
    },
    plugins: [react()],
  };
});

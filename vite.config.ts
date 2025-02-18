import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@tensorflow/tfjs-converter": "./node_modules/@tensorflow/tfjs-converter",
      "@tensorflow/tfjs": "./node_modules/@tensorflow/tfjs",
    },
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 443,
      host: "0.0.0.0",
    },
  },
});

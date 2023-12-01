import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

import dns from "dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    // alias: {
    //   "@": "/src",
    //   // components: "/src/components",
    // },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

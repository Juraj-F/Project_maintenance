import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",     // bind to all interfaces (prevents IPv4/IPv6 issues)
    port: 5173,          // use a clean port that is not wedged
    strictPort: true,    // fail instead of silently switching
    open: false,

    hmr: {
      host: "127.0.0.1", // force stable HMR target
      protocol: "ws",
    },
  

      proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/API": {
        target: "http://localhost/Basic-Blog/back_end", // ต้นทางจริง (PHP API)

        // //upload to server
        // target: "http://student.crru.ac.th/661463026/BASIC-BLOG-API", // ต้นทางจริง (PHP API)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, "API"),
      },
    },
  },
});

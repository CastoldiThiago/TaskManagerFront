import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL || 'https://taskmanagerback-rz32.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: './',
})

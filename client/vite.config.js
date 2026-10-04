import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies API + audio calls to the Express backend on :5000,
// so from the browser everything is same-origin (no CORS in development).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/audio': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});

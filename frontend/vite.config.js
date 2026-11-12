import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
const proxy = {
  '/api': { target: process.env.ROUTEBOOKS_API_TARGET || 'http://localhost:5123', changeOrigin: true },
  '/imgs': { target: process.env.ROUTEBOOKS_API_TARGET || 'http://localhost:5123', changeOrigin: true },
};
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  test: { environment: 'jsdom', setupFiles: './src/setupTests.js', globals: true },
});

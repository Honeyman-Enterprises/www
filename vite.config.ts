import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Replace GA4 Measurement ID placeholder with actual value from env
        const gaId = process.env.VITE_GA_MEASUREMENT_ID || '';
        return html.replace(/VITE_GA_MEASUREMENT_ID/g, gaId);
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5181,
    strictPort: true,
  },
})

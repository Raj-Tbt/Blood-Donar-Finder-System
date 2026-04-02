/**
 * Vite Configuration
 *
 * Configures the Vite build tool with React plugin, PWA support,
 * and API proxy for backend communication during development.
 *
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Blood Donor Finder',
        short_name: 'BloodDonor',
        description: 'Find blood donors near you. One Drop. One Life.',
        theme_color: '#C0392B',
        background_color: '#1A1A2E',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      /* Proxy API requests to the Express backend during development */
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',        // auto-updating service worker
      injectRegister: 'auto',            // inject SW registration
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],
      manifest: {
        id: '/',
        name: 'Games Hub',
        short_name: 'GamesHub',
        description:
          'Search games, manage wishlist, favorites and played list with a personalized dashboard.',
        theme_color: '#0b1929',
        background_color: '#020617',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/dashboard-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshots/dashboard-mobile.png',
            sizes: '720x1280',
            type: 'image/png',
          }
        ]
      }
    })
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
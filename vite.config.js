import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // MANUAL UPDATE ONLY (User Request)
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-512.png'],
      manifest: {
        name: 'Syndicate OS: Street Tycoon',
        short_name: 'Syndicate',
        description: 'Build your criminal empire in the Danish underworld.',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './index.html',
        scope: './',
        icons: [
          {
            src: 'pwa-512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '1.1.4')
  },
  base: '/Syndicate-os/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})

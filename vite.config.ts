import react from '@vitejs/plugin-react'
import autoImport from 'unplugin-auto-import/vite'
import iconsResolver from 'unplugin-icons/resolver'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    vitePWA({
      mode: 'production',
      includeAssets: ['favicon.ico'],
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,json,svg,txt}']
      },
      manifest: {
        name: 'Sumplete',
        short_name: 'Sumplete',
        theme_color: '#eff6ff',
        background_color: '#eff6ff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '1024x1024',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.solid.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    autoImport({
      dts: false,
      resolvers: [
        iconsResolver({
          prefix: false,
          extension: 'jsx',
          enabledCollections: ['tabler'],
          alias: { icon: 'tabler' }
        })
      ]
    }),
    icons({ compiler: 'jsx', jsx: 'react' })
  ],
  worker: {
    format: 'es'
  }
})

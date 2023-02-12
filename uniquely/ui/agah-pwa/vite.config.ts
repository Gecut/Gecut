import {defineConfig} from 'vite';
import {VitePWA as vitePWA} from 'vite-plugin-pwa';

import type {ManifestOptions} from 'vite-plugin-pwa';
import type {GenerateSWOptions} from 'workbox-build';

const DIST_PATH = 'build/';
const serviceWorker: Partial<GenerateSWOptions> = {
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  swDest: `${DIST_PATH}sw.js`,
  globDirectory: DIST_PATH,
  globPatterns: ['**/*.{html,js,css,woff,png,ico,svg}'],
};
const manifestJson: Partial<ManifestOptions> = {
  /* i18n */
  dir: 'rtl',
  lang: 'fa-IR',

  /* url */
  scope: '/',
  start_url: '/?pwa',

  /* info */
  name: 'آگاه',
  short_name: 'آگاه',
  description: 'Agah PWA',

  /* screen */
  display: 'standalone',
  orientation: 'portrait',

  /* theming */
  theme_color: '#ffe9d9',
  background_color: '#ffe9d9',

  /* icons */
  icons: [
    {
      src: 'images/icon-192-maskable.png',
      type: 'image/png',
      sizes: '192x192',
      purpose: 'maskable',
    },
    {
      src: 'images/icon-512-maskable.png',
      type: 'image/png',
      sizes: '512x512',
      purpose: 'maskable',
    },
    {src: 'images/icon-192.png', type: 'image/png', sizes: '192x192'},
    {src: 'images/icon-512.png', type: 'image/png', sizes: '512x512'},
  ],
};

export default defineConfig({
  server: {
    hmr: true,
    open: true,
    host: '0.0.0.0',
    port: 9090,
  },
  build: {
    outDir: DIST_PATH,
    reportCompressedSize: true,
  },
  plugins: [
    vitePWA({
      workbox: serviceWorker,
      manifest: manifestJson,
      mode: 'production',
      outDir: DIST_PATH,
      useCredentials: true,
    }),
  ],
});

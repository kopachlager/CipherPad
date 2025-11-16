import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Disable PWA during troubleshooting to avoid stale SWs
    // VitePWA({
    //   injectRegister: 'auto',
    //   registerType: 'autoUpdate',
    //   manifest: false, // use existing public/manifest.json
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     navigateFallback: '/index.html',
    //   },
    //   devOptions: {
    //     enabled: false, // set to true to test SW in dev
    //   },
    // }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  css: {
    postcss: './postcss.config.js',
  },
});

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'vueMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsMount': './src/mount/ProductsMount.js',
        './SettingsMount': './src/mount/SettingsMount.js',
      },
      shared: [],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 3000,
    cors: true,
  },
  server: {
    port: 3000,
    cors: true,
  },
})

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.CLIENT_PORT,
    host: process.env.CLIENT_HOST
  },
  build: {
    outDir: '../build/client',
    emptyOutDir: true
  }


})

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure _redirects file is copied to dist
    copyPublicDir: true,
  },
  server: {
    port: 5173,
    open: true
  }
})


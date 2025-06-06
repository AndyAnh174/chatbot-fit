import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5176,
    strictPort: true,
    cors: true,
    allowedHosts: ['chatbot.andyanh.id.vn'],
    proxy: {
      '/api': {
        target: 'https://apichatbotfit.andyanh.id.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5176,
    strictPort: true,
    cors: true,
    allowedHosts: ['chatbot.andyanh.id.vn']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})

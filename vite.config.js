import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer':       ['framer-motion'],
          'markdown':     ['react-markdown', 'remark-gfm', 'rehype-highlight'],
          'icons':        ['lucide-react'],
        },
      },
    },
  },
})

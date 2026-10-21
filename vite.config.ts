import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Fontes nunca viram base64 no CSS: o navegador só baixa os subsets
    // (latin, cyrillic…) que a página realmente usa.
    assetsInlineLimit: (filePath) => (/\.(woff2?|ttf|otf)$/.test(filePath) ? false : undefined),
  },
})

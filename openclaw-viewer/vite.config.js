import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Set base path for GitHub Pages deployment
  // Uses repo name from env, or '/' for local dev / custom domain
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})

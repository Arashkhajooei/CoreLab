import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project under /CoreLab/.
// HashRouter is used in the app so no server-side SPA rewrite is needed.
export default defineConfig({
  base: '/CoreLab/',
  plugins: [react()],
})

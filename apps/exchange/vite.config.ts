import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@agce/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@agce/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@agce/hooks': path.resolve(__dirname, '../../packages/hooks/src/index.ts'),
      '@agce/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
  },
})

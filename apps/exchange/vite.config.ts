import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@agce/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@agce/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@agce/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@agce/hooks': path.resolve(__dirname, '../../packages/hooks/src/index.ts'),
      '@agce/binance': path.resolve(__dirname, '../../packages/binance/src/index.ts'),
    },
  },
  server: {
    host: true,
  },
  build: {
    outDir: `dist/${process.env['VITE_INSTANCE'] ?? 'global'}`,
  },
})

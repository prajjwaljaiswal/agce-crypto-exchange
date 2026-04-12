import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gatewayTarget = env.VITE_API_PROXY_TARGET || 'http://192.168.1.16:8080'

  return {
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
      proxy: {
        '/api': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
        '/healthz': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: `dist/${process.env['VITE_INSTANCE'] ?? 'global'}`,
    },
  }
})

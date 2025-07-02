import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'development' ? '/' : '/react-permission-manage/'

  return {
    base: baseUrl,
    plugins: [
      react(),
      visualizer({
        open: true,
        filename: 'stats.html',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       manualChunks(id) {
    //         if (id.includes('node_modules')) {
    //           if (
    //             id.includes('react') ||
    //             id.includes('react-dom') ||
    //             id.includes('react-router-dom')
    //           ) {
    //             return 'react-vendor'
    //           }
    //           if (id.includes('@ant-design/icons')) {
    //             return 'ant-design-icons'
    //           }
    //           return 'vendor'
    //         }

    //         if (id.includes('/src/views/')) {
    //           return 'views'
    //         }
    //         if (id.includes('/src/components/')) {
    //           return 'components'
    //         }
    //         if (id.includes('/src/store/')) {
    //           return 'store'
    //         }
    //         return undefined
    //       },
    //     },
    //   },
    // },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  }
})

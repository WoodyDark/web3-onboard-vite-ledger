import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const MODE = process.env.NODE_ENV
const development = MODE === 'development'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    development &&
    nodePolyfills({
      include: [
        'node_modules/**/*.js',
        new RegExp('node_modules/.vite/.*js')
      ],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert'
    }
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: ['@shapeshiftoss/proto-tx-builder'],
  },
})

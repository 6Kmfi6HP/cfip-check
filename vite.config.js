import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({

  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://p01--boiling-frame--kw6dd7bjv2nr.code.run',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/check'),
        // headers: {}, // 移除原有的 header
        // selfHandleResponse: true, // 开启处理响应
        onProxyRes: (proxyRes) => {
          const res = new Response(proxyRes.body) // 创建新的响应,不包含头信息
          return res
        }

      }
    }
  },

  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }

})
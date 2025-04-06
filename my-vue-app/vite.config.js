import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 监听所有 IP（包括局域网）
    port: 5173,      // 指定端口（默认是 5173）
    strictPort: true, // 如果端口被占用直接报错
  }
})
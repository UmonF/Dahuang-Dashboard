import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署配置
  // 如果部署到 https://<username>.github.io/<repo>/，设置 base 为 /<repo>/
  // 如果部署到 https://<username>.github.io/，设置 base 为 /
  base: '/Dahuang-Dashboard/',
})

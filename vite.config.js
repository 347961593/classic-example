import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import cesium from 'vite-plugin-cesium';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    cesium(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@views': path.resolve(__dirname, "src/views"),
      '@comp': path.resolve(__dirname, "src/components"),
      '@router': path.resolve(__dirname, "src/router"),
      '@utils': path.resolve(__dirname, "src/utils"),
      '@store': path.resolve(__dirname, "src/store"),
      '@assets': path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
})
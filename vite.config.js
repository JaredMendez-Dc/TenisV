import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'datatables.net-dt': path.resolve(__dirname, 'node_modules/datatables.net-dt'),
      'datatables.net-buttons': path.resolve(__dirname, 'node_modules/datatables.net-buttons'),
      'datatables.net-responsive-dt': path.resolve(__dirname, 'node_modules/datatables.net-responsive-dt')
    }
  }
})

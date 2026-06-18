import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuración de Vite para el proyecto Vue.js 3
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: false
  }
})

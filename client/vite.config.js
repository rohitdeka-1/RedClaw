import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts: ["89f71a0fb1d4.ngrok-free.app","2f1627067ba2.ngrok-free.app ","ngrok-free.app"]
  }
})

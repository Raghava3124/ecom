import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,               // allows access from external devices
    allowedHosts: true,       // allows all hostnames (including dynamic ngrok URLs)
  },
})

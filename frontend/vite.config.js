import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["react-detect-offline"]
    }
  },
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://localhost:5000",
        changeOrigin:true,
        secure:false
      }
    }

  },
  
})

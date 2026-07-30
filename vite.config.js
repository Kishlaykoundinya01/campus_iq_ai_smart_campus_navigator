import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
   // port: 5173,
    //host: true
    
    allowedHosts: [
      "campus-iq-ai-smart-campus-navigator.onrender.com"
    ]
  
  }
})

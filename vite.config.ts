import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {


    // 1. The VIP Lane for CSS (Must be first!)
  '@cpath/ui/styles.css': path.resolve(__dirname, '../../packages/ui/src/styles.css'),
  
  // 2. The General Lane for everything else
  '@cpath/ui': path.resolve(__dirname, '../../packages/ui/index.ts'),
    },
  },
  server: {
    port: 3003, // The Community App lives here
  },
})

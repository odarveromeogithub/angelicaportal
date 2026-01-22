import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunking strategy
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (
              id.includes('@reduxjs/toolkit') ||
              id.includes('redux') ||
              id.includes('react-redux') ||
              id.includes('redux-saga') ||
              id.includes('redux-persist')
            ) {
              return 'vendor-redux'
            }
            if (id.includes('lucide-react') || id.includes('sonner') || id.includes('framer') || id.includes('motion')) {
              return 'vendor-ui'
            }
            return 'vendor-utils'
          }
          // Split major local feature areas
          if (id.includes('/src/app/modules/shared/angelica-life-plan/')) {
            return 'chunk-forms'
          }
          if (id.includes('/src/app/core/components/ui/')) {
            return 'chunk-ui'
          }
          if (id.includes('/src/app/core/state/')) {
            return 'chunk-state'
          }
          return undefined
        },
      },
    },
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  },
})


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
            // Redux state management (separate because it's independent)
            if (
              id.includes('@reduxjs/toolkit') ||
              id.includes('redux-saga') ||
              id.includes('redux-persist')
            ) {
              return 'vendor-redux'
            }
            // All other vendor dependencies in one chunk
            // This avoids circular dependencies and ensures stable vendor bundle
            return 'vendor'
          }
          // Split major local feature areas
          if (id.includes('/src/app/core/components/ui/') || 
              id.includes('/src/app/core/components/form/') ||
              id.includes('/src/app/modules/shared/angelica-life-plan/')) {
            return 'chunk-components'
          }
          if (id.includes('/src/app/core/state/')) {
            return 'chunk-state'
          }
          return undefined
        },
      },
    },
    // Set chunk size warning threshold
    // Adjusted for vendor bundles which benefit from long-term caching
    chunkSizeWarningLimit: 850,
  },
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps in production
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      output: {
        // Manual chunking to optimize loading
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'ui-vendor': ['@mantine/core', '@mantine/notifications', '@mantine/hooks'],
          'utils': ['date-fns', 'uuid', 'yup']
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // Place CSS files in css directory
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Optimize build for better performance
    target: 'es2015',
    minify: 'esbuild',
    // Inline small assets to reduce requests
    assetsInlineLimit: 4096 // 4kb
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@mantine/core',
      '@mantine/notifications'
    ]
  },
  // CSS configuration
  css: {
    // Optimize CSS modules
    modules: {
      localsConvention: 'camelCase'
    },
    // PostCSS configuration for production optimization
    postcss: {
      plugins: []
    }
  }
})

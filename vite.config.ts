import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better performance
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'vendor-editor': ['@monaco-editor/react'],
          'vendor-utils': ['clsx', 'tailwind-merge', 'zustand', 'class-variance-authority'],
          
          // Mermaid and diagram libraries
          'mermaid-core': ['mermaid'],
          
          // Export and canvas libraries
          'vendor-export': ['html2canvas', 'jspdf'],
          
          // Supabase and API
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Icons and UI components
          'vendor-icons': ['lucide-react'],
          
          // Notifications
          'vendor-toast': ['sonner'],
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
 
    tsconfigPaths()
  ],
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'mermaid',
      '@monaco-editor/react',
      '@supabase/supabase-js',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ],
    exclude: [
      // Exclude large libraries from pre-bundling for better performance
      'html2canvas',
      'jspdf'
    ]
  },
})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolve } from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'analysis' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  assetsInclude: ['**/*.glb', '**/*.png'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "gsap/SplitText": resolve(__dirname, "node_modules/gsap/SplitText")
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More granular chunk splitting based on analysis
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            // Group other larger dependencies
            if (id.includes('node_modules')) {
              return 'vendor-other';
            }
          }
          
          // Split your own code by routes/pages
          if (id.includes('src/components/VisionSection')) {
            return 'vision-section';
          }
          if (id.includes('src/components/') || id.includes('src/pages/')) {
            const match = id.match(/src\/(components|pages)\/([^\/]+)/);
            if (match) {
              return `chunk-${match[2].toLowerCase()}`;
            }
          }
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000, // Increase warning limit
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'gsap'],
    exclude: ['lucide-react'] // Exclude to prevent pre-bundling issues
  }
}));
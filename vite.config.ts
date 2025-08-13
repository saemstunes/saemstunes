import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolve } from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  assetsInclude: ['**/*.glb', '**/*.png'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "gsap/SplitText": resolve(__dirname, "node_modules/gsap/SplitText") // Added GSAP alias
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          utils: ['clsx', 'tailwind-merge', 'framer-motion'],
          gsap: ['gsap'] // Added GSAP to vendor chunk
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'gsap'] // Added GSAP to deps
  }
}));

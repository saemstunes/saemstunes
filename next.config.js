/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Image optimization configuration
  images: {
    domains: [
      'uxyvhqtwkutstihtxdsv.supabase.co',
      'images.unsplash.com',
      'i.imgur.com',
      'img.youtube.com',
      'lh3.googleusercontent.com',
      'upload.wikimedia.org',
      '*.googleusercontent.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Compress responses
  compress: true,
  
  // Enable production browser source maps for debugging
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
};

// Bundle analyzer configuration (only enabled during analysis)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
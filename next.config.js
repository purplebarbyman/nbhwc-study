/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  
  // Image optimization settings for static export
  images: {
    unoptimized: true,
  },
  
  // Remove asset prefix and base path for Cloudflare Pages
  // Cloudflare serves from root, not subdirectory
  assetPrefix: '',
  basePath: '',
  
  // Performance optimizations
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // React strict mode
  reactStrictMode: true,
  
  // Power optimization
  poweredByHeader: false,
  
  // Compression settings
  compress: true,
  
  // Ensure proper static generation
  generateEtags: false,
  
  // Optimize for static hosting
  distDir: '.next',
}

module.exports = nextConfig

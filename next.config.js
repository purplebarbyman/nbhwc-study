/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  
  // Image optimization settings for static export
  images: {
    unoptimized: true,
  },
  
  // Asset and base path configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nbhwc-study' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/nbhwc-study' : '',
  
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
  
  // React strict mode (moved to correct location)
  reactStrictMode: true,
  
  // Power optimization
  poweredByHeader: false,
  
  // Compression settings
  compress: true,
}

module.exports = nextConfig

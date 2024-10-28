import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Prevent cache issues in development
    if (dev) {
      config.cache = false
    }

    // Add module aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/spaces': './src/spaces',
      '@/components': './src/components',
      '@/lib': './src/lib'
    }

    return config
  },
  // Optimize for development
  experimental: {
    optimizeCss: true,
    turbo: true,
  },
  // Image domains
  images: {
    domains: ['localhost', 'your-production-domain.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

export default withPayload(nextConfig)

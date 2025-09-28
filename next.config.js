/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Disabled optimizePackageImports for production webpack compatibility
    // Works with Turbopack (dev) but causes build failures with webpack (production)
    // optimizePackageImports: [
    //   'lucide-react',
    //   'framer-motion',
    // ],
    // Server Actions cross-origin configuration
    serverActions: {
      allowedOrigins: [
        '127.0.0.1:5000',
        'localhost:5000',
        'f67e16c3-f99c-4248-a504-44ed34cb11e0-00-46s72nends43.janeway.replit.dev',
        'f67e16c3-f99c-4248-a504-44ed34cb11e0-00-46s72nends43.janeway.replit.dev:5000',
        '*.janeway.replit.dev',
      ],
    },
  },

  // Resolve cross-origin warning - proper format without protocols
  allowedDevOrigins: [
    '127.0.0.1:5000',
    'localhost:5000',
    'f67e16c3-f99c-4248-a504-44ed34cb11e0-00-46s72nends43.janeway.replit.dev',
    'f67e16c3-f99c-4248-a504-44ed34cb11e0-00-46s72nends43.janeway.replit.dev:5000',
    '*.janeway.replit.dev',
  ],

  // Image optimization  
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Compression and security
  compress: true,
  poweredByHeader: false,

  // Removed webpack configuration to avoid conflict with Turbopack
  // Bundle splitting will be handled by Next.js route-level chunking

  // Redirects for route standardization
  async redirects() {
    return [
      {
        source: '/chat/:id',
        destination: '/dashboard/chat/:id',
        permanent: true,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', 
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
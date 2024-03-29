/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'ufrlknboiuzkwcshtwry.supabase.co',
      'images.unsplash.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/explore',
        destination: '/',
        permanent: true,
      },
      {
        source: '/lessons',
        destination: '/',
        permanent: true,
      },
    ]
  },
})

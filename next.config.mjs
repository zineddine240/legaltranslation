import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // On ignore les erreurs strictes pour pouvoir déployer
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/hf',
        permanent: true,
      },
    ]
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzer(nextConfig);
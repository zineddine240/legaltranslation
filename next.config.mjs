import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  // --- AJOUT DE LA REDIRECTION ICI ---
  async redirects() {
    return [
      {
        source: '/',       // Quand on arrive sur l'accueil
        destination: '/hf', // On est envoyé vers ta page modèle
        permanent: true,    // C'est une redirection définitive
      },
    ]
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzer(nextConfig);
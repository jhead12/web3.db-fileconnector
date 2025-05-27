/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next",
  allowedDevOrigins: ['local-origin.dev', 'localhost', "127.0.0.1"],
  experimental: {
    esmExternals: true,
  },
  transpilePackages: [
    '@useorbis/db-sdk',
    '@graphiql/create-fetcher',
    'graphiql',
    'ace-builds'
  ],
  webpack: (config, { isServer }) => {
    // Handle ES modules properly
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    return config;
  },
};

export default nextConfig;
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next",
  allowedDevOrigins: ["local-origin.dev", "localhost", "127.0.0.1"],
  experimental: {
    esmExternals: true,
  },
  transpilePackages: [
    "@useorbis/db-sdk",
    "@graphiql/create-fetcher",
    "graphiql",
    "ace-builds",
  ],  webpack: (config, { isServer }) => {
    // Handle ES modules properly
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    // Add React resolution to ensure a single copy using path aliasing
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    };
    
    // Ensure only one copy of React is used
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime': path.resolve('./node_modules/react/jsx-runtime'),
        'react/jsx-dev-runtime': path.resolve('./node_modules/react/jsx-dev-runtime'),
      };
    }

    return config;
  },
};

export default nextConfig;

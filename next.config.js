/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: 'https://badovik.shop',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'badovik.shop',
        pathname: '/wp-content/uploads/**',
      },
    ],
    unoptimized: false, // Включаем оптимизацию изображений для производительности
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      // Дополнительные заголовки для правильного кэширования статических ресурсов
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      // Заголовки для HTML страниц
      {
        source: '/((?!api/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Настройки для webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Настройка для лучшего chunking
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;

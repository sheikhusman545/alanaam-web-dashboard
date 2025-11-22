const path = require("path");
const withImages = require("next-images");

const nextConfig = withImages({
  transpilePackages: ["@fullcalendar"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/scss')],
  },
  trailingSlash: true,
  webpack: (config, { isServer, webpack }) => {
    // Handle font files
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)$/,
      type: "asset/resource",
    });
    
    // Exclude server-connect-api from serverless function builds
    // This file uses ES modules and causes SyntaxError in serverless functions
    // Use externals to prevent it from being bundled into serverless functions
    if (isServer) {
      // Mark server-connect-api as external so it's not bundled
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          '../api/config/server-connect-api': 'commonjs ../api/config/server-connect-api',
          '../../api/config/server-connect-api': 'commonjs ../../api/config/server-connect-api',
          '../../../api/config/server-connect-api': 'commonjs ../../../api/config/server-connect-api',
          './config/server-connect-api': 'commonjs ./config/server-connect-api',
          '@/api/config/server-connect-api': 'commonjs @/api/config/server-connect-api',
        });
      }
      
      // Also use IgnorePlugin as backup
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          checkResource(resource) {
            if (!resource) return false;
            return /server-connect-api/.test(resource);
          },
        })
      );
    }
    
    // Polyfill document for styled-jsx during SSR/build
    // Note: We import polyfills in _app.tsx and _document.tsx instead of modifying webpack entries
    // This avoids webpack chunk issues
    
    return config;
  },
});

module.exports = nextConfig;

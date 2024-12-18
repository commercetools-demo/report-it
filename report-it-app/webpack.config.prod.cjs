const {
  createWebpackConfigForProduction,
  } = require('@commercetools-frontend/mc-scripts/webpack');
  
  // Create the default config
  const config = createWebpackConfigForProduction();
  
  // Customize the config
  config.module.rules = config.module.rules.concat({
    test: /\.sdl$/,
    use: 'raw-loader'
  }
);
  
  // Export the config
  module.exports = config;
  
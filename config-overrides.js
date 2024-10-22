/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@styles': path.resolve(__dirname, 'src/styles/scss'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@helpers': path.resolve(__dirname, 'src/helpers'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@app-types': path.resolve(__dirname, 'src/types'),
  };
  return config;
};

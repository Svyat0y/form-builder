/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@styles': path.resolve(__dirname, 'src/styles/scss'),
    '@actions': path.resolve(__dirname, 'src/actions'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@common': path.resolve(__dirname, 'src/common'),
    '@containers': path.resolve(__dirname, 'src/containers'),
    '@helper': path.resolve(__dirname, 'src/helper'),
    '@icon': path.resolve(__dirname, 'src/icon'),
    '@reducers': path.resolve(__dirname, 'src/reducers'),
  };
  return config;
};

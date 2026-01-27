/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    // FSD aliases
    '@/app': path.resolve(__dirname, 'src/app'),
    '@/pages': path.resolve(__dirname, 'src/pages'),
    '@/widgets': path.resolve(__dirname, 'src/widgets'),
    '@/features': path.resolve(__dirname, 'src/features'),
    '@/entities': path.resolve(__dirname, 'src/entities'),
    '@/shared': path.resolve(__dirname, 'src/shared'),
    // Styles alias for SCSS imports
    '@styles': path.resolve(__dirname, 'src/shared/ui/styles/scss'),
  }

  // Ignore source map warnings from node_modules
  config.ignoreWarnings = [
    // Ignore source map warnings from react-spinners-css
    /Failed to parse source map.*react-spinners-css/,
    // Ignore all source map warnings from node_modules
    function (warning) {
      return (
        warning.module &&
        warning.module.resource &&
        warning.module.resource.includes('node_modules') &&
        warning.message &&
        warning.message.includes('Failed to parse source map')
      )
    },
  ]

  // Configure sass-loader to resolve @styles alias
  const oneOfRule = config.module.rules.find((rule) => rule.oneOf)
  if (oneOfRule) {
    const sassRule = oneOfRule.oneOf.find(
      (rule) =>
        rule.test &&
        rule.test.toString().includes('scss|sass') &&
        Array.isArray(rule.use),
    )

    if (sassRule && sassRule.use) {
      const sassLoader = sassRule.use.find(
        (loader) =>
          typeof loader === 'object' &&
          loader.loader &&
          loader.loader.includes('sass-loader'),
      )

      if (sassLoader) {
        sassLoader.options = {
          ...sassLoader.options,
          sassOptions: {
            ...sassLoader.options?.sassOptions,
            includePaths: [
              path.resolve(__dirname, 'src/shared/ui/styles/scss'),
            ],
            importer: [
              (url) => {
                if (url.startsWith('@styles/')) {
                  return {
                    file: path.resolve(
                      __dirname,
                      'src/shared/ui/styles/scss',
                      url.replace('@styles/', ''),
                    ),
                  }
                }
                return null
              },
            ],
          },
        }
      }
    }
  }

  return config
}

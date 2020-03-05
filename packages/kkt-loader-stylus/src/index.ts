import { Configuration } from 'webpack';
import getStyleLoaders from 'kkt/lib/utils/getStyleLoaders';
import getCSSModuleLocalIdent from 'kkt/lib/utils/getCSSModuleLocalIdent';
import { OptionConf } from 'kkt/lib/config/webpack.config';

const sassRegex = /\.(styl)$/;
const sassModuleRegex = /\.module\.(styl)$/;

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
module.exports = (conf: Configuration, options: OptionConf) => {
  return [
    // Opt-in support for SASS (using .styl or .sass extensions).
    // By default we support Stylus Modules with the
    // extensions .module.styl or .module.sass
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        }, options,
        require.resolve('stylus-loader')
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules, but using SASS
    // using the extension .module.styl or .module.sass
    {
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
          }
        }, options,
        require.resolve('stylus-loader')
      ),
    }
  ];
}

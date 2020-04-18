import { Configuration } from 'webpack';
import getStyleLoaders from 'kkt/lib/utils/getStyleLoaders';
import getCSSModuleLocalIdent from 'kkt/lib/utils/getCSSModuleLocalIdent';
import { OptionConf } from 'kkt';

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
module.exports = (conf: Configuration, options: OptionConf) => {
  return [
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
    {
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        }, options,
        require.resolve('sass-loader')
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules, but using SASS
    // using the extension .module.scss or .module.sass
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
        require.resolve('sass-loader')
      ),
    }
  ];
}

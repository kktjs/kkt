import { Configuration } from 'webpack';
import getStyleLoaders from 'kkt/lib/utils/getStyleLoaders';
import getCSSModuleLocalIdent from 'kkt/lib/utils/getCSSModuleLocalIdent';
import { OptionConf } from 'kkt';

const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
module.exports = (conf: Configuration, options: OptionConf) => {
  return [
    // Opt-in support for LESS (using .scss or .less extensions).
    // By default we support LESS Modules with the
    // extensions .module.scss or .module.less
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        }, options,
        require.resolve('less-loader')
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules, but using LESS
    // using the extension .module.scss or .module.less
    {
      test: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
          }
        }, options,
        require.resolve('less-loader')
      ),
    }
  ];
}

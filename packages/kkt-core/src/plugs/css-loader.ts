import webpack, { Configuration } from 'webpack';
import getCSSModuleLocalIdent from '../utils/getCSSModuleLocalIdent';
import { OptionConf } from '../config/webpack.config';
import getStyleLoaders, { CssOptions } from '../utils/getStyleLoaders';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

export type Loaders = {
  loader?: string;
  options?: {
    publicPath?: string;
    sourceMap?: boolean;
  } | CssOptions;
} | string;

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
module.exports = (conf: Configuration, options: OptionConf) => {
  return [
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    // By default we support CSS Modules with the extension .module.css
    {
      test: cssRegex,
      exclude: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
      }, options),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
      test: cssModuleRegex,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent,
        }
      }, options),
    }
  ];
};

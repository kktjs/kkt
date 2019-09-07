import webpack, { Configuration } from 'webpack';
import getCSSModuleLocalIdent from '../utils/getCSSModuleLocalIdent';
import { OptionConf } from '../config/webpack.config';
import getStyleLoaders from '../utils/getStyleLoaders';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

export interface CssOptions {
  importLoaders?: number;
  sourceMap?: boolean;
  modules?: boolean | string | {
    localIdentName?: string;
    getLocalIdent?: CssOptions['getLocalIdent'];
  };
  getLocalIdent?: (context: webpack.loader.LoaderContext, localIdentName: string, localName: string, options: object) => string;
}

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
  conf.module.rules = conf.module.rules.map((item) => {
    if (item.oneOf) {
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use MiniCSSExtractPlugin to extract that CSS
      // to a file, but in development "style" loader enables hot editing
      // of CSS.
      // By default we support CSS Modules with the extension .module.css
      item.oneOf.push({
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
      });

      // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
      // using the extension .module.css
      item.oneOf.push({
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent,
        }, options),
      });

      // Opt-in support for SASS (using .scss or .sass extensions).
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      item.oneOf.push({
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 1,
            sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
          }, options,
          'sass-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      });

      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      item.oneOf.push({
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 1,
            sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent,
          }, options,
          'sass-loader'
        ),
      });


      // Opt-in support for SASS (using .scss or .sass extensions).
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      item.oneOf.push({
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 1,
            sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
          }, options,
          'less-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      });

      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      item.oneOf.push({
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 1,
            sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent,
          }, options,
          'less-loader'
        ),
      });

    }
    return item;
  });
  return conf;
};

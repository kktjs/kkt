import webpack, { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import getCSSModuleLocalIdent from '../utils/getCSSModuleLocalIdent';
import { OptionConf } from '../config/webpack.config';

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
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = options.publicPath === './';
  // common function to get style loaders
  const getStyleLoaders = (cssOptions: CssOptions, preProcessor?: string) => {
    if (cssOptions.modules || cssOptions.getLocalIdent) {
      cssOptions.modules = {};
      // cssOptions.modules.localIdentName = options.isEnvDevelopment ? '[path]__[name]___[local]' : '[hash:8]';
      cssOptions.modules.getLocalIdent = cssOptions.getLocalIdent;
    }
    delete cssOptions.getLocalIdent;
    const loaders: Loaders[] = [
      options.isEnvDevelopment && require.resolve('style-loader'),
      options.isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            postcssNormalize(),
          ],
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: options.isEnvProduction && options.shouldUseSourceMap,
        },
      });
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      });
    }
    return loaders;
  };

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
        }),
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
        }),
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
          },
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
          },
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
          },
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
          },
          'less-loader'
        ),
      });

    }
    return item;
  });
  return conf;
};

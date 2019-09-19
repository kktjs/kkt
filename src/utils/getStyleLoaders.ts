
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import { OptionConf } from '../config/webpack.config';

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

export default (cssOptions: CssOptions, options: OptionConf, preProcessor?: string) => {
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = options.publicPath === './';
  // common function to get style loaders
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
      loader: preProcessor,
      options: {
        sourceMap: true,
      },
    });
  }
  return loaders;
};
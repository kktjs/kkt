
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import { OptionConf } from '../config/webpack.config';

export interface CssOptions {
  importLoaders?: number;
  sourceMap?: boolean;
  modules?: boolean | string | {
    localIdentName?: string;
    getLocalIdent?: (context: webpack.loader.LoaderContext, localIdentName: string, localName: string, options: object) => string;
  };
}


export type Loaders = {
  loader?: string;
  options?: {
    publicPath?: string;
    sourceMap?: boolean;
  } | CssOptions;
} | string;

export default (cssOptions: CssOptions, options: OptionConf, preProcessor?: string) => {
  const loaders: Loaders[] = [
    options.isEnvDevelopment && require.resolve('style-loader'),
    options.isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: options.publicUrlOrPath.startsWith('.')
        ? { publicPath: '../../' }
        : {},
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
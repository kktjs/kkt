
import webpack, { RuleSetUseItem } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import { ParsedArgs } from 'minimist';
import { paths } from './path';

export interface CssOptions {
  importLoaders?: number;
  sourceMap?: boolean;
  modules?: boolean | string | {
    localIdentName?: string;
    getLocalIdent?: (context: webpack.loader.LoaderContext, localIdentName: string, localName: string, options: object) => string;
  };
}

export type StyleLoadersOptions<T> = ParsedArgs & {
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  preProcessorOptions: T | {};
}


/**
 * 方法来源
 * https://github.com/facebook/create-react-app/blob/39689239c18a1d77fb303e285b26beb1a4b650c0/packages/react-scripts/config/webpack.config.js#L107-L166
 * @param cssOptions 
 * @param options 
 * @param preProcessor 
 */
export const getStyleLoaders = <T>(cssOptions: CssOptions, options = {} as StyleLoadersOptions<T>, preProcessor: string) => {
  const loaders: RuleSetUseItem[] = [];
  if (options.isEnvDevelopment) {
    loaders.push(require.resolve('style-loader'))
  }

  if (options.isEnvProduction) {
    loaders.push({
      // loader: MiniCssExtractPlugin.loader,
      loader: options.miniCssExtractPluginLoader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.')
        ? { publicPath: '../../' }
        : {},
    });
  }
  loaders.push({
    loader: require.resolve('css-loader'),
    options: cssOptions,
  });
  loaders.push({
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
      sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
    },
  });

  if (preProcessor) {
    loaders.push({
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
        root: paths.appSrc,
      } as any,
    });
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
        ...options.preProcessorOptions,
      },
    });
  }
  return loaders;
};
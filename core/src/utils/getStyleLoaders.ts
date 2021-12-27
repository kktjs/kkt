import { RuleSetUseItem, LoaderContext } from 'webpack';
import postcssNormalize from 'postcss-normalize';
// @ts-ignore
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
// @ts-ignore
import postcssPresetEnv from 'postcss-preset-env';
import { ParsedArgs } from 'minimist';
import { paths } from './path';

/** https://github.com/webpack-contrib/css-loader/blob/master/test/validate-options.test.js */
export interface CssOptions {
  importLoaders?: number;
  import?:
    | boolean
    | {
        filter: (url: string, media: unknown, resourcePath: string) => boolean;
      };
  sourceMap?: boolean;
  esModule?: boolean;
  exportType?: 'array' | 'string' | 'css-style-sheet';
  url?:
    | boolean
    | {
        filter: (url: string, resourcePath: string) => boolean;
      };
  modules?:
    | boolean
    | 'global'
    | 'local'
    | 'pure'
    | 'icss'
    | {
        mode?: 'global' | 'local' | 'pure' | 'icss' | (() => 'local');
        localIdentName?: string;
        localIdentContext?: string;
        localIdentHashSalt?: string;
        localIdentHashFunction?: string;
        localIdentHashDigest?: string;
        localIdentHashDigestLength?: string;
        localIdentRegExp?: string | RegExp;
        exportGlobals?: boolean;
        namedExport?: boolean;
        exportOnlyLocals?: boolean;
        exportLocalsConvention?:
          | 'asIs'
          | 'camelCase'
          | 'camelCaseOnly'
          | 'dashes'
          | 'dashesOnly'
          | ((localName: string) => string);
        auto?: boolean | RegExp | (() => boolean);
        getLocalIdent?: (
          loaderContext: LoaderContext<unknown>,
          // context: webpack.loader.LoaderContext,
          localIdentName: string,
          localName: string,
        ) => string;
      };
}

export type StyleLoadersOptions<T> = ParsedArgs & {
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  preProcessorOptions: T | {};
};

/**
 * 方法来源
 * https://github.com/facebook/create-react-app/blob/9673858a3715287c40aef9e800c431c7d45c05a2/packages/react-scripts/config/webpack.config.js#L118-L197
 */
export const getStyleLoaders = <T>(
  cssOptions: CssOptions,
  options = {} as StyleLoadersOptions<T>,
  preProcessor: string,
) => {
  const loaders: RuleSetUseItem[] = [];
  if (options.isEnvDevelopment) {
    loaders.push(require.resolve('style-loader'));
  }

  if (options.isEnvProduction) {
    loaders.push({
      // loader: MiniCssExtractPlugin.loader,
      loader: options.miniCssExtractPluginLoader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
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
      postcssOptions: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        config: false,
        plugins: [
          postcssFlexbugsFixes(),
          postcssPresetEnv({
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
      },
      sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
    },
  });

  if (preProcessor) {
    loaders.push({
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
        root: paths.appSrc,
      },
    });
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
        ...options.preProcessorOptions,
      },
    });
  }
  return loaders;
};

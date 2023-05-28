import { Configuration, RuleSetRule } from 'webpack';
import { ParsedArgs } from 'minimist';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { getStyleLoaders, LoaderConfOptions, MiniCssExtractPlugin } from 'kkt';

const sassRegex = /\.(styl)$/;
const sassModuleRegex = /\.module\.(styl)$/;

type StylusLoaderOptionsBase = {
  /**
   * Enables/Disables generation of source maps.
   * @default compiler.devtool
   */
  sourceMap?: boolean;
  /**
   * Enables/Disables the default Webpack importer.
   * @default true
   */
  webpackImporter?: boolean;
};

export type StylusLoaderOptions = LoaderConfOptions &
  StylusLoaderOptionsBase & {
    additionalData?: string;
    stylusOptions?: (loaderContext: { resourcePath: string; rootContext: string }) => void;
  } & {
    stylusOptions?: {
      /**
       * Specify Stylus plugins to use. Plugins may be passed as
       * strings instead of importing them in your Webpack config.
       *
       * @type {(string|Function)[]}
       * @default []
       */
      use?: (string | (() => void))[];
      /** Add path(s) to the import lookup paths. */
      include?: string[];
      /** Import the specified Stylus files/paths. */
      import?: string[];
      /** Array is the recommended syntax: [key, value, raw] */
      define?: Array<(string | boolean | number)[]> | Record<string, string | boolean | number>;
      /** Include regular CSS on @import. */
      includeCSS?: boolean;
      /**
       * Emits comments in the generated CSS indicating the corresponding Stylus line.
       *
       * @see https://stylus-lang.com/docs/executable.html
       *
       * @type {boolean}
       * @default false
       */
      lineNumbers?: boolean;
      /**
       * Move @import and @charset to the top.
       *
       * @see https://stylus-lang.com/docs/executable.html
       *
       * @type {boolean}
       * @default false
       */
      hoistAtrules?: boolean;
      /**
       * Compress CSS output.
       * In the "production" mode is `true` by default
       *
       * @see https://stylus-lang.com/docs/executable.html
       *
       * @type {boolean}
       * @default false
       */
      compress?: boolean;
      /**
       * Resolve relative url()'s inside imported files.
       *
       * @see https://stylus-lang.com/docs/js.html#stylusresolveroptions
       *
       * @type {boolean|Object}
       * @default { nocheck: true }
       */
      resolveURL?: boolean | Record<string, string | boolean | number>;
    };
    /**
     * Prepends/Appends Stylus code to the actual entry file.
     */
    additionalData?: (
      content: string,
      loaderContext: {
        resourcePath: string;
        rootContext: string;
      },
    ) => string;
  };

const createStylusModule = (stylusLoaderOptions = {} as StylusLoaderOptions) => {
  return function (conf: Configuration, evn: string, options = {} as ParsedArgs) {
    if (!conf) {
      throw Error('KKT:ConfigPaths: there is no config file found');
    }
    options.isEnvProduction = evn === 'production';
    options.isEnvDevelopment = evn === 'development';

    const loaders: RuleSetRule[] = [];
    loaders.push({
      test: sassRegex,
      exclude: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
          modules: {
            mode: 'icss',
          },
        },
        {
          ...options,
          isEnvProduction: options.isEnvProduction,
          isEnvDevelopment: options.isEnvDevelopment,
          shouldUseSourceMap: options.shouldUseSourceMap,
          miniCssExtractPluginLoader: MiniCssExtractPlugin.loader,
          preProcessorOptions: {
            ...stylusLoaderOptions,
          },
        },
        require.resolve('stylus-loader'),
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    });

    loaders.push({
      test: sassModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
          modules: {
            mode: 'local',
            // @ts-ignore
            //💥🔥🚨🚸🚫⛔️🔄 Upgrade `@types/react-dev-utils`
            getLocalIdent: getCSSModuleLocalIdent,
          },
        },
        {
          ...options,
          isEnvProduction: options.isEnvProduction,
          isEnvDevelopment: options.isEnvDevelopment,
          shouldUseSourceMap: options.shouldUseSourceMap,
          miniCssExtractPluginLoader: MiniCssExtractPlugin.loader,
          preProcessorOptions: {
            ...stylusLoaderOptions,
          },
        },
        require.resolve('stylus-loader'),
      ),
    });

    // Exclude all less files (including module files) from file-loader
    conf.module.rules = conf.module.rules.map((rule) => {
      if (typeof rule === 'object' && rule.oneOf) {
        loaders.forEach((item) => rule.oneOf.splice(rule.oneOf.length - 1, 0, item));
      }
      return rule;
    });
    return conf;
  };
};

/**
 * Use create-react-app to build react libraries. Support for regular less files and *.module.less files.
 */
const stylusModule = createStylusModule();
(stylusModule as any).withLoaderOptions = createStylusModule;

export default stylusModule;

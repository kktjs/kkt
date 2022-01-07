import { Configuration, RuleSetRule } from 'webpack';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { getStyleLoaders, LoaderConfOptions, MiniCssExtractPlugin } from 'kkt';

const lessRegex = /\.(less)$/;
const lessModuleRegex = /\.module\.(less)$/;

type LessLoaderOptionsBase = {
  /**
   * @default compiler.devtool
   */
  sourceMap?: boolean;
  /**
   * @default true
   */
  webpackImporter?: boolean;
};

export type LessLoaderOptions = LessLoaderOptionsBase & {
  lessOptions?: (loaderContext: any) => void;
} & {
  lessOptions?: Record<string, any>;
};

const createLessModule = (lessLoaderOptions = {} as LessLoaderOptions) => {
  return function (conf: Configuration, evn: string, options = {} as LoaderConfOptions) {
    if (!conf) {
      throw Error('KKT:@kkt/less-modules: there is no config found');
    }
    options.isEnvProduction = evn === 'production';
    options.isEnvDevelopment = evn === 'development';

    const loaders: RuleSetRule[] = [];
    loaders.push({
      test: lessRegex,
      exclude: lessModuleRegex,
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
            implementation: require.resolve('less'),
            ...lessLoaderOptions,
          },
        },
        require.resolve('less-loader'),
      ),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    });

    loaders.push({
      test: lessModuleRegex,
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
            implementation: require.resolve('less'),
            ...lessLoaderOptions,
          },
        },
        require.resolve('less-loader'),
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
const module = createLessModule();
(module as any).withLoaderOptions = createLessModule;

export default module;

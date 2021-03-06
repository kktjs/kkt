import { Configuration, RuleSetRule } from 'webpack';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getStyleLoaders, LoaderConfOptions } from 'kkt';

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
      throw Error('KKT:ConfigPaths: there is no config file found');
    }
    options.isEnvProduction = evn === 'production';
    options.isEnvDevelopment = evn === 'development';

    const loaders: RuleSetRule[] = [];
    loaders.push({
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders(
        {
          importLoaders: 1,
          sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
        },
        {
          ...options,
          isEnvProduction: options.isEnvProduction,
          isEnvDevelopment: options.isEnvDevelopment,
          shouldUseSourceMap: options.shouldUseSourceMap,
          miniCssExtractPluginLoader: MiniCssExtractPlugin.loader,
          preProcessorOptions: {
            lessOptions: {
              javascriptEnabled: true,
            },
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
          importLoaders: 1,
          sourceMap: options.isEnvProduction ? options.shouldUseSourceMap : options.isEnvDevelopment,
          modules: {
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
            lessOptions: {
              javascriptEnabled: true,
            },
            ...lessLoaderOptions,
          },
        },
        require.resolve('less-loader'),
      ),
    });

    // Exclude all less files (including module files) from file-loader
    conf.module.rules = conf.module.rules.map((rule) => {
      if (rule.oneOf) {
        rule.oneOf = rule.oneOf.map((item) => {
          if (typeof item.loader === 'string' && /(file-loader)/.test(item.loader)) {
            if (Array.isArray(item.exclude)) {
              item.exclude.push(lessRegex);
            }
          }
          return item;
        });
        rule.oneOf = loaders.concat(rule.oneOf);
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

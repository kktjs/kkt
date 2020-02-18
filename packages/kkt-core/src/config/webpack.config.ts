import webpack, { Configuration, RuleSetRule } from 'webpack';
import fs from 'fs';
import loadConf, { KKTRC, LoaderDefaultResult }  from '@kkt/config-loader';
import * as paths from './paths';
import { ClientEnvironment } from './env';
import { Argv } from 'yargs';

export interface OptionConf {
  /**
   * 环境变量
   */
  env: string;
  dotenv: ClientEnvironment;
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  isEnvProductionProfile: boolean;
  shouldUseSourceMap: boolean;
  useTypeScript: boolean;
  publicUrlOrPath: string;
  yargsArgs: Argv;
  paths: {
    moduleFileExtensions: string[];
  };
  moduleScopePluginOpts?: KKTRC<OptionConf>['moduleScopePluginOpts'];
}

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

export default async (env: string = 'development', args?: Argv) => {
  const kktConf = await loadConf(paths.appKKTRC);
  let conf: Configuration = {};
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');
  const dotenv = require('./env').getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  conf.mode = isEnvProduction ? 'production' : (isEnvDevelopment ? 'development' : 'none');
  conf.plugins = [];
  conf.resolve = {};
  // Stop compilation early in production
  conf.bail = isEnvProduction;
  conf.optimization = {
    minimize: isEnvProduction,
    minimizer: [],
  };
  conf.module = {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
    ],
  }
  conf.devtool = isEnvProduction ? (shouldUseSourceMap ? 'source-map' : false) : (isEnvDevelopment ? 'cheap-module-source-map' : false);

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  conf.node = {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  };
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  conf.performance = false;
  conf.entry = [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ].filter(Boolean);

  // =============================================
  // Disable require.ensure as it's not a standard language feature.
  const optionConf: OptionConf = {
    env, dotenv, paths, isEnvDevelopment, isEnvProduction, isEnvProductionProfile,
    shouldUseSourceMap, useTypeScript,
    publicUrlOrPath: paths.publicUrlOrPath,
    yargsArgs: args,
  };

  /**
   * Modify `moduleScopePlugin` options.
   */
  if(kktConf.moduleScopePluginOpts) {
    optionConf.moduleScopePluginOpts = kktConf.moduleScopePluginOpts
  }

  conf = require('../plugs/optimization')(conf, optionConf);
  conf = require('../plugs/output')(conf, optionConf);
  conf = require('../plugs/resolve')(conf, optionConf);
  /**
   * Add loader
   * ============================
   */
  conf.module.rules = [...(require('../plugs/eslint-loader')(conf, optionConf))];
  let loaderDefault: LoaderDefaultResult<OptionConf> = {
    url: require('../plugs/url-loader'),
    babel: require('../plugs/babel-loader'),
    css: require('../plugs/css-loader'),
    file: require('../plugs/file-loader'),
  }
  if (kktConf && kktConf.loaderDefault && typeof kktConf.loaderDefault === 'function') {
    let loaderConf = kktConf.loaderDefault(loaderDefault, conf, optionConf);
    if (loaderConf) loaderDefault = loaderConf;
  }

  let loaderOneOf: RuleSetRule[] = [];
  if (kktConf && kktConf.loaderOneOf && Array.isArray(kktConf.loaderOneOf)) {
    loaderOneOf = await Promise.all((kktConf.loaderOneOf as any).map(async (item: string | [string, object?]) => {
      return Array.isArray(item) ? (await require(item[0])(conf, optionConf, item[1] ? item[1] : {}))
        : (await require(item)(conf, optionConf, {}));
    }));
  }
  const defaultLoader = await Promise.all(Object.keys(loaderDefault).map(async (keyName: keyof LoaderDefaultResult<OptionConf>) => {
    if (loaderDefault[keyName] && typeof loaderDefault[keyName] == 'function') {
      return await loaderDefault[keyName](conf, optionConf);
    }
  }));
  let loader: RuleSetRule[] = [];
  [...loaderOneOf, ...defaultLoader].filter(Boolean).forEach((item: RuleSetRule) => {
    loader = loader.concat(item);
  });
  // "oneOf" will traverse all following loaders until one will
  // match the requirements. When no loader matches it will fall
  // back to the "file" loader at the end of the loader list.
  conf.module.rules.push({ oneOf: [...loader] });

  // Use webpack plugins.
  conf = require('../plugs/plugins')(conf, optionConf);

  const deafultKKTConf = (kktConf.default || kktConf)
  if (deafultKKTConf && typeof deafultKKTConf === 'function'){
    conf = deafultKKTConf(conf, optionConf, webpack) || conf;
  }
  return conf;
}
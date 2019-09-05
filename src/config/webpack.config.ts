import { Configuration } from 'webpack';
import path from 'path';
import fs from 'fs';
import * as paths from './paths';
import { ClientEnvironment } from '../type/type';
import loadConfHandle from '../utils/loadConf';

export interface OptionConf {
  /**
   * 环境变量
   */
  env: string;
  dotenv: ClientEnvironment;
  isEnvDevelopment: boolean;
  isEnvProduction: boolean;
  shouldUseSourceMap: boolean;
  publicPath: string;
  publicUrl: string;
  useTypeScript: boolean;
  paths: {
    moduleFileExtensions: string[];
  };
}

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

export default async (env: string = 'development', conf: Configuration = {}) => {
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';

  const appPackageJson = require(paths.appPackageJson as string);

  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && '/';
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && '';
  const dotenv = require('./env').getClientEnvironment(publicUrl);
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
    rules: [],
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
    isEnvDevelopment &&
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // Finally, this is your app's code:
    paths.appIndexJs as string,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ].filter(Boolean);
  conf.output = {
    // The build folder.
    path: isEnvProduction ? paths.appBuild as string : undefined,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isEnvDevelopment,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
    // TODO: remove this when upgrading to webpack 5
    futureEmitAssets: true,
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    // We use "/" in development.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: isEnvProduction
      ? info => path
          .relative(paths.appSrc as string, info.absoluteResourcePath)
          .replace(/\\/g, '/')
      : isEnvDevelopment &&
      (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    // Prevents conflicts when multiple Webpack runtimes (from different apps)
    // are used on the same page.
    jsonpFunction: `webpackJsonp${appPackageJson.name}`,
  }
  // =============================================
  // Disable require.ensure as it's not a standard language feature.
  const optionConf: OptionConf = { env, dotenv, paths, isEnvDevelopment, isEnvProduction, shouldUseSourceMap, publicPath, publicUrl, useTypeScript };

  conf = require('../plugs/optimization')(conf, optionConf);
  conf = require('../plugs/resolve')(conf, optionConf);
  conf = require('../plugs/eslint-loader')(conf, optionConf);
  // "oneOf" will traverse all following loaders until one will
  // match the requirements. When no loader matches it will fall
  // back to the "file" loader at the end of the loader list.
  conf.module.rules.push({ oneOf: [] });
  conf = require('../plugs/url-loader')(conf, optionConf);
  conf = require('../plugs/babel-loader')(conf, optionConf);
  conf = require('../plugs/css-loader')(conf, optionConf);
  conf = require('../plugs/file-loader')(conf, optionConf);
  // Use webpack plugins.
  conf = require('../plugs/plugins')(conf, optionConf);
  const kktConf = await loadConfHandle(paths.appKKTRC);
  conf = (kktConf.default || kktConf)(conf, optionConf) || conf;
  return conf;
}
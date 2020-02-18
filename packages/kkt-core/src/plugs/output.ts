import { Configuration } from 'webpack';
import path from 'path';
import * as paths from '../config/paths';
import { OptionConf } from '../config/webpack.config';

module.exports = (conf: Configuration, { isEnvProduction, isEnvDevelopment, publicUrlOrPath }: OptionConf) => {
  const appPackageJson = require(paths.appPackageJson as string);
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
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: publicUrlOrPath,
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
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: 'this',
  }
  return conf;
};

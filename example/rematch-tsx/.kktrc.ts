import path from 'path';
import { OptionConf } from 'kkt';
import webpack from 'webpack';

type Webpack = typeof webpack;

export const loaderOneOf = [
  require.resolve('@kkt/loader-less')
];

export const moduleScopePluginOpts = [
  path.resolve(process.cwd(), 'README.md')
];

export default (conf: webpack.Configuration, opts: OptionConf, webpack: Webpack) => {
  const pkg = require(path.resolve(process.cwd(), 'package.json'));

  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
  );

  return conf;
}

/**
 * mocker-api that creates mocks for REST APIs.
 * It will be helpful when you try to test your application without the actual REST API server.
 * https://github.com/jaywcjlove/mocker-api
 */
export const mocker = {
  path: path.resolve('./mocker/index.js'),
  /**
   * https://github.com/jaywcjlove/mocker-api/tree/96c2eb94694571e0e3003e6ad9ce1c809499f577#options
   */
  option: {},
}
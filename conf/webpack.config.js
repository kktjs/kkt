const path = require('path');
const webpack = require('webpack');
const SimpleProgressWebpackPlugin = require('@kkt/simple-progress-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./');
const devServer = require('./webpack.config.server');

const getClientEnv = require('./env').getClientEnv;
const nodePath = require('./env').nodePath;

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
// const shouldUseRelativeAssetPaths = publicPath === './';

module.exports = (env = 'dev') => {
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';

  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';
  const kktrc = require('../utils/loadKKTRC')(paths.appKKTRC); // eslint-disable-line
  const dotenv = getClientEnv();
  let conf = {
    mode: IS_DEV ? 'development' : 'production',
    // Set webpack context to the current command's directory
    context: process.cwd(),
    plugins: [],
    optimization: {},
    module: {
      strictExportPresence: true,
      rules: [],
    },
    // We need to tell webpack how to resolve both APP's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean)
      ),
      extensions: ['.mjs', '.jsx', '.js', '.json', '.ts', '.tsx'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };

  if (IS_PROD) conf.bail = true;
  if (IS_DEV) {
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebook/create-react-app/issues/343
    // conf.devtool = 'cheap-module-source-map';
  } else {
    // Don't attempt to continue if there are any errors.
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    // conf.devtool = shouldUseSourceMap ? 'source-map' : false;
  }

  conf.resolveLoader = {
    modules: [paths.appNodeModules, paths.ownNodeModules],
  };

  // =============================================
  // Disable require.ensure as it's not a standard language feature.
  conf.module.rules.push({ parser: { requireEnsure: false } });

  const optionConf = { env, dev: IS_DEV, kktrc, ...dotenv, ...paths };

  conf = require('../plugs/rule-eslint')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-url')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-ts')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-babel')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-css')(conf, optionConf); // eslint-disable-line
  conf = require('../plugs/rule-file')(conf, optionConf); // eslint-disable-line

  conf.plugins.push(new SimpleProgressWebpackPlugin({
    format: 'compact',
    name: 'KKT',
  }));

  // We define environment variables that can be accessed globally in our
  conf.plugins.push(new webpack.DefinePlugin(dotenv.stringified));
  if (IS_DEV) {
    // Setup Webpack Dev Server on port 3001 and
    // specify our client entry point /client/index.js
    conf.entry = [
      require.resolve('webpack-hot-dev-clients/webpackHotDevClient'),
      paths.appIndex,
    ];
    // Configure our client bundles output. Not the public path is to 3001.
    conf.output = {
      path: paths.appBuildDist,
      publicPath: paths.appPublicPath,
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[hash:8].js',
    };
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    // Configure webpack-dev-server to serve our client-side bundle from
    // http://${dotenv.raw.HOST}:3001
    conf.devServer = devServer(dotenv);
    conf.plugins.push(new HtmlWebpackPlugin({
      inject: true,
      favicon: paths.defaultFaviconPath,
      template: paths.appHtml,
    }));
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebook/create-react-app/issues/240
    conf.plugins.push(new CaseSensitivePathsPlugin());
  } else {
    // Specify production entry point (/client/index.js)
    conf.entry = {
      client: paths.appIndex,
    };
    // Specify the client output directory and paths. Notice that we have
    // changed the publiPath to just '/' from http://localhost:3001. This is because
    // we will only be using one port in production.
    conf.output = {
      path: paths.appBuildDist,
      publicPath: dotenv.raw.PUBLIC_PATH || '/',
      filename: 'static/js/bundle.[chunkhash:8].js',
      chunkFilename: 'static/js/[chunkhash:8].chunk.js',
      libraryTarget: 'var',
    };
    conf = require('../plugs/optimization')(conf, { env }); // eslint-disable-line
    if (!optionConf.raw.BUNDLE) {
      conf.plugins.push(new HtmlWebpackPlugin({
        inject: true,
        favicon: paths.defaultFaviconPath,
        template: paths.appHtml,
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          removeComments: true,
          removeEmptyAttributes: true,
        },
      }));
    }
  }

  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  conf.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  if (!optionConf.raw.BUNDLE) {
    conf.plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/bundle.[contenthash:8].css',
      chunkFilename: 'static/css/[contenthash:8].chunk.css',
      // allChunks: true because we want all css to be included in the main
      // css bundle when doing code splitting to avoid FOUC:
      // https://github.com/facebook/create-react-app/issues/2415
      allChunks: true,
    }));
  }

  conf.plugins.filter(Boolean);
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  conf.node = {
    ...conf.node,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  };
  // Load private .kkt.conf.js config file.
  conf = require('../utils/loadConfig')(conf, optionConf, webpack); // eslint-disable-line
  return conf;
};

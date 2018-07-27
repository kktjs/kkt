const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');
const config = require('./webpack.config');
const paths = require('./path');

module.exports = function () {
  config.mode = 'production';
  config.entry = [paths.appIndex];
  config.output.filename = 'js/[name].[hash:8].js';
  config.output.chunkFilename = 'js/[name].[hash:8].js';
  config.module.rules = config.module.rules.map((item) => {
    if (item.oneOf) {
      const loaders = [];
      item.oneOf = loaders.concat(item.oneOf);
    }
    return item;
  });

  config.plugins = config.plugins.concat([
    new CleanWebpackPlugin(paths.appBuildDist, {
      root: process.cwd(),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      favicon: paths.defaultFaviconPath,
      template: paths.defaultHTMLPath,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true,
      },
    }),
    // new webpack.DefinePlugin({
    //   VERSION: JSON.stringify(pkg.version),
    // }),
    // 将模块名称添加到工厂功能，以便它们显示在浏览器分析器中。
    // 当接收到热更新信号时，在浏览器console控制台打印更多可读性高的模块名称等信息
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
    }),
  ]);

  return config;
};

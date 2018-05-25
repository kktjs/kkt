const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const PATH = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CreateSpareWebpackPlugin = require('create-spare-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxtjs/friendly-errors-webpack-plugin');
const config = require('./webpack.config');
const paths = require('./path');

module.exports = function () {
  config.mode = 'development';
  config.entry = [
    require.resolve('webpack-hot-dev-clients/webpackHotDevClient'),
    paths.appIndex,
  ];
  config.module.rules = config.module.rules.map((item) => {
    // if (item.oneOf) {
    //   const loaders = [];
    //   loaders.push();
    //   item.oneOf = loaders.concat(item.oneOf);
    // }
    return item;
  });


  config.plugins = config.plugins.concat([
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      // favicon: paths.defaultFaviconPath,
      template: paths.defaultHTMLPath,
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

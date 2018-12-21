const webpack = require('webpack');
const conf = require('../conf/webpack.config.prod');
const paths = require('../conf/path');
require('colors-cli/toxic');

module.exports = function serve() {
  let webpackConf = conf();
  if (paths.appKKTRC) {
    const kktrc = require(paths.appKKTRC); // eslint-disable-line
    webpackConf = kktrc(webpackConf, null) || webpackConf;
  }

  const compiler = webpack(webpackConf);
  compiler.run((err, stats) => {
    // 官方输出参数
    // https://webpack.js.org/configuration/stats/
    // https://github.com/webpack/webpack/issues/538#issuecomment-59586196
    if (stats && stats.toString) {
      const message = stats.toString({
        colors: true,
        children: false,
        chunks: false,
        modules: false,
        moduleTrace: false,
        warningsFilter: () => true,
      });
      console.log(message); // eslint-disable-line
    }
  });
};

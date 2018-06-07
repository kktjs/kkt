const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const openBrowsers = require('open-browsers');
const detect = require('detect-port');
require('colors-cli/toxic');
const paths = require('../conf/path');
const webpackDevConf = require('../conf/webpack.config.dev');
const createDevServerConfig = require('../conf/webpack.config.server');


module.exports = function server() {
  let DEFAULT_PORT = process.env.PORT || 19870;
  const HOST = process.env.HOST || '0.0.0.0';
  const webpackConf = webpackDevConf();
  // 如果配置文件存在读取配置文件
  let compiler = null;
  let webpackServerConf = null;
  if (paths.appKKTRC) {
    const kktrc = require(paths.appKKTRC); // eslint-disable-line
    compiler = webpack(kktrc(webpackConf, null) || webpackConf);
    webpackServerConf = kktrc(null, createDevServerConfig(webpackConf)) || createDevServerConfig(webpackConf);
  } else {
    compiler = webpack(webpackConf);
    webpackServerConf = createDevServerConfig(webpackConf);
  }
  // https://webpack.js.org/api/compiler-hooks/#aftercompile
  // 编译完成之后打印日志
  compiler.hooks.done.tap('done', () => {
    // eslint-disable-next-line
    console.log(`\nDev Server Listening at ${`http://${HOST}:${DEFAULT_PORT}`.green}`);
  });

  detect(DEFAULT_PORT).then((_port) => {
    if (DEFAULT_PORT !== _port) DEFAULT_PORT = _port;
    new WebpackDevServer(compiler, webpackServerConf).listen(DEFAULT_PORT, HOST, (err) => {
      if (err) {
        return console.log(err); // eslint-disable-line
      }
      openBrowsers(`http://${HOST}:${DEFAULT_PORT}`);
    });
  }).catch((err) => {
    console.log('~~~::::', err); // eslint-disable-line
  });
};

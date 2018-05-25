const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');
const detect = require('detect-port');
const load = require('loading-cli');
require('colors-cli/toxic');
const webpackDevConf = require('../conf/webpack.config.dev');
const createDevServerConfig = require('../conf/webpack.config.server');


module.exports = function server() {
  let DEFAULT_PORT = process.env.PORT || 19870;
  const HOST = process.env.HOST || '0.0.0.0';
  const loading = load('Compiler is running...'.green).start();
  loading.color = 'green';

  const webpackConf = webpackDevConf();
  const compiler = webpack(webpackConf);
  // https://webpack.js.org/api/compiler-hooks/#aftercompile
  // 编译完成之后打印日志
  compiler.hooks.done.tap('done', () => {
    loading.stop();
    // eslint-disable-next-line
    console.log(`\nDev Server Listening at ${`http://${HOST}:${DEFAULT_PORT}`.green}`);
  });

  detect(DEFAULT_PORT).then((_port) => {
    if (DEFAULT_PORT !== _port) DEFAULT_PORT = _port;
    new WebpackDevServer(compiler, createDevServerConfig(webpackConf)).listen(DEFAULT_PORT, HOST, (err) => {
      if (err) {
        return console.log(err); // eslint-disable-line
      }
      // open browser
      opn(`http://${HOST}:${DEFAULT_PORT}`);
    });
  }).catch((err) => {
    console.log('~~~::::', err); // eslint-disable-line
  });
}

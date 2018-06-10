const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const openBrowsers = require('open-browsers');
const detect = require('detect-port');
require('colors-cli/toxic');
const paths = require('../conf/path');
const webpackDevConf = require('../conf/webpack.config.dev');
const createDevServerConfig = require('../conf/webpack.config.server');

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

module.exports = function server() {
  let DEFAULT_PORT = parseInt(process.env.PORT, 10) || 19870;
  const HOST = process.env.HOST || '0.0.0.0';
  let webpackConf = webpackDevConf();

  let webpackServerConf = null;
  // 如果配置文件存在读取配置文件
  if (paths.appKKTRC) {
    const kktrc = require(paths.appKKTRC); // eslint-disable-line
    webpackConf = kktrc(webpackConf, null) || webpackConf;
    webpackServerConf = kktrc(null, createDevServerConfig(webpackConf)) || createDevServerConfig(webpackConf);
  } else {
    webpackServerConf = createDevServerConfig(webpackConf);
  }

  const compiler = webpack(webpackConf);
  // https://webpack.js.org/api/compiler-hooks/#aftercompile
  // 编译完成之后打印日志
  compiler.hooks.done.tap('done', () => {
    // eslint-disable-next-line
    console.log(`\nDev Server Listening at ${`http://${HOST}:${DEFAULT_PORT}`.green}`);
  });

  detect(DEFAULT_PORT).then((_port) => {
    if (DEFAULT_PORT !== _port) DEFAULT_PORT = _port;
    const devServer = new WebpackDevServer(compiler, webpackServerConf);
    devServer.listen(DEFAULT_PORT, HOST, (err) => {
      if (err) {
        return console.log(err); // eslint-disable-line
      }
      clearConsole();
      openBrowsers(`http://${HOST}:${DEFAULT_PORT}`);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });
  }).catch((err) => {
    if (err && err.message) {
      console.log(err.message); // eslint-disable-line
    }
    process.exit(1);
  });
};

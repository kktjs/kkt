import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'

import debug from './debug'
import {deepToString} from './utils'


export default function devServer(webpackConfig, serverConfig, cb) {
  let compiler = webpack(webpackConfig)

  let {host, port, ...otherServerConfig} = serverConfig

  let webpackDevServerOptions = merge({
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    hot: true,
    noInfo: true,
    overlay: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  }, otherServerConfig)

  debug('webpack dev server options: %s', deepToString(webpackDevServerOptions))

  let server = new WebpackDevServer(compiler, webpackDevServerOptions)

  function onServerStart(err) {
    if (err) cb(err)
  }

  // 只有在用户明确指定的情况下才提供主机配置
  if (host) {
    server.listen(port, host, onServerStart)
  }
  else {
    server.listen(port, onServerStart)
  }
}

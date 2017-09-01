import detect from 'detect-port'
import debug from './debug'
import getPluginConfig from './getPluginConfig'
import createServerWebpackConfig from './createServerWebpackConfig'
import getUserConfig from './getUserConfig'
import devServer from './devServer'
import {DEFAULT_PORT} from './constants'
import {clearConsole} from './utils'


// 获取端口运行服务器，检测预期端口是否可用，并提示用户是否。
function getServerPort(args, cb) {
  let intendedPort = args.port || DEFAULT_PORT
  // 端口检测器的JavaScript实现
  detect(intendedPort, (err, suggestedPort) => {
    if (err) return cb(err)
    // 不需要提示是否有可用的端口
    if (suggestedPort === intendedPort) return cb(null, suggestedPort)
    // 支持使用--force来避免交互提示
    if (args.force) return cb(null, suggestedPort)

    if (args.clear !== false && args.clearConsole !== false) {
      clearConsole()
    }
    console.log(`Something is already running on port ${intendedPort}.`.yellow)
    console.log()
    // 常用的交互式命令行用户界面的集合。
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'run',
        message: 'Would you like to run the app on another port instead?',
        default: true,
      },
    ]).then(
      ({run}) => cb(null, run ? suggestedPort : null),
      (err) => cb(err)
    )
  })
}

export default function webpackServer(args, buildConfig, cb) {
  // 默认开发环境 - 我们还在测试时运行dev服务器来检查HMR是否工作。
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
  }


  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args)
  }

  let serverConfig

  try {
    serverConfig = getUserConfig(args, {/*pluginConfig*/}).devServer
  } catch (e) {
    return cb(e)
  }
  debug(serverConfig)

  // 用户可以通过CLI提供其他配置
  getServerPort(args, (err, port) => {
    if (err) return cb(err)
    debug('port',port)
    // 空端口表示用户选择不在出现提示时运行服务器
    if (port === null) return cb()

    serverConfig.port = port
    // 主机可以被--host覆盖
    if (args.host) serverConfig.host = args.host
      debug("buildConfig.plugins::",buildConfig.plugins)

    if (!('status' in buildConfig.plugins)) {
      buildConfig.plugins.status = {
        disableClearConsole: args.clear === false || args['clear-console'] === false,
        successMessage:
          `The app is running at http${serverConfig.https ? 's' : ''}://${args.host || 'localhost'}:${port}/`,
      }
    }

    let webpackConfig
    try {
      webpackConfig = createServerWebpackConfig(args, buildConfig, serverConfig)
    }catch (e) {
      return cb(e)
    }

    // debug('webpack config: %s', deepToString(webpackConfig))
    debug('webpack config: %s',JSON.stringify(webpackConfig,null,2))

    devServer(webpackConfig, serverConfig, cb)
  })
}

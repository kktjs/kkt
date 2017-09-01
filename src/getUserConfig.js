import fs from 'fs'
import path from 'path'
import * as color from 'colors-cli/toxic'
import webpack from 'webpack'
import debug from './debug'
import {typeOf,deepToString} from './utils'
import {CONFIG_FILE_NAME,PROJECT_TYPES} from './constants'
import {UserConfigReport} from './userConfigReport'
import {ConfigValidationError} from './errors'
const DEFAULT_REQUIRED = false


// 验证用户配置并执行任何必要的验证和转换。
export function processUserConfig({
    args = {},
    check = false,
    pluginConfig = {},
    required = DEFAULT_REQUIRED,
    userConfig,
    userConfigPath,
}){

  // 配置模块可以导出一个函数，
  // 如果他们需要访问当前命令或web应用程序依赖kkt管理它们。
  if (typeOf(userConfig) === 'function') {
    userConfig = userConfig({
      args,
      command: args._[0],
      webpack,
    })
  }

  let report = new UserConfigReport(userConfigPath)

  // 判断配置文件类型
  if ((required || 'type' in userConfig) && !PROJECT_TYPES.has(userConfig.type)) {
    report.error('type', userConfig.type, `Must be one of: ${[...PROJECT_TYPES].join(', ')}`)
  }

  let argumentOverrides = {}
  void ['babel', 'devServer', 'karma', 'npm', 'webpack'].forEach(prop => {
    // 设置顶级配置对象的默认值，这样我们就不必存在了 - 检查它们到处都是。
    if (!(prop in userConfig)) {
      userConfig[prop] = {}
    }
    // 允许 path.to.config 配置文件覆盖
    if (typeOf(args[prop]) === 'object') {
      argumentOverrides[prop] = args[prop]
    }
  })

  // Babel 关键配置，错误情况
  if (!!userConfig.babel.stage || userConfig.babel.stage === 0) {
    if (typeOf(userConfig.babel.stage) !== 'number') {
      report.error('babel.stage', userConfig.babel.stage,
        `Must be a ${'Number'.cyan} between ${'0'.cyan} and ${'3'.cyan}, or ${'false'.cyan} to disable use of a stage preset.`
      )
    }else if (userConfig.babel.stage < 0 || userConfig.babel.stage > 3) {
      report.error(
        'babel.stage', userConfig.babel.stage, `Must be between ${'0'.cyan} and ${'3'.cyan}`
      )
    }
  }
  if (userConfig.babel.presets) {
    if (typeOf(userConfig.babel.presets) === 'string') {
      userConfig.babel.presets = [userConfig.babel.presets]
    }
    else if (typeOf(userConfig.babel.presets) !== 'array') {
      report.error('babel.presets', userConfig.babel.presets, `Must be a string or an ${'Array'.cyan}`)
    }
  }

  // Webpack 关键配置，错误情况
  if ('rules' in userConfig.webpack) {
    if (typeOf(userConfig.webpack.rules) !== 'object') {
      report.error('webpack.rules', `type: ${typeOf(userConfig.webpack.rules)}`, `Must be an ${'Object'.cyan}.`)
    }
  }
  
  if (report.hasErrors()) {
    throw new ConfigValidationError(report)
  }
  if (check) {
    throw report
  }
  if (report.hasSomethingToReport()) {
    report.log()
  }

  debug('user config: %s', deepToString(userConfig))
  
  return userConfig
}

// 加载用户配置文件并进行处理。
export default function getUserConfig(args = {}, options = {}) {
  let {
    check = false,
    // 获取插件参数
    pluginConfig = {}, // eslint-disable-line no-unused-vars
    required = DEFAULT_REQUIRED,
  } = options

  // 尝试加载默认用户配置，或使用我们给出的配置文件路径
  let userConfig = {}
  // kkt.config.js 的路径地址
  let userConfigPath = path.resolve(args.config || CONFIG_FILE_NAME)

  // 如果需要配置文件并且不存在，请提前说明
  let configFileExists = fs.existsSync(userConfigPath)

  // 判断配置文件是否存在
  if (!configFileExists) {
    throw new Error(`Couldn't find a config file at ${userConfigPath}`)
  }


  // 如果配置文件存在，它应该是一个有效的模块，而不管它是否需要。
  if (configFileExists) {
    try {
      userConfig = require(userConfigPath)
      debug('imported config module from %s',userConfigPath)
      // 从需求缓存中删除文件，因为某些构建需要使用不同的NODE_ENV多次导入。
      delete require.cache[userConfigPath]
    }catch (e) {
      throw new Error(`Couldn't import the config file at ${userConfigPath}: ${e.message}\n${e.stack}`)
    }
  }
  // 检查用户配置
  userConfig = processUserConfig({args, check, pluginConfig, required, userConfig, userConfigPath})

  // 配置文件存在
  if (configFileExists) userConfig.path = userConfigPath;
  
  return userConfig
}
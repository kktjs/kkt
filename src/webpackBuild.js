
import webpack from 'webpack'
import createWebpackConfig from './createWebpackConfig'
import getUserConfig from './getUserConfig'
import {deepToString} from './utils'
import loading from 'loading-cli'
import debug from './debug'
import {logBuildResults} from './webpackUtils'

/**
 * 如果您传递非错误类型，这将处理微调显示和输出记录本身，否则使用回调中提供的统计信息。
 */
export default function webpackBuild(type, args, buildConfig, cb) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
  }


  let userConfig
  try {
    userConfig = getUserConfig(args, {/*pluginConfig*/})
  }catch (e) {
    return cb(e)
  }


  if (typeof buildConfig == 'function') {
    buildConfig = buildConfig(args)
  }

  let webpackConfig
  try {
    webpackConfig = createWebpackConfig(buildConfig, {/*pluginConfig*/}, userConfig)
  }catch (e) {
    return cb(e)
  }

  debug('webpack config: %s',type, deepToString(webpackConfig))

  let spinner
  if (type) {
    spinner = loading(`Cleaning ${type}`).start()
  }

  let compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) {
      if (spinner) {
        spinner.fail()
      }
      return cb(err)
    }
    if (spinner || stats.hasErrors()) {
      logBuildResults(stats, spinner)
    }
    if (stats.hasErrors()) {
      return cb(new Error('Build failed with errors.'))
    }
    cb(null, stats)
  })

}
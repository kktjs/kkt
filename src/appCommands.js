// @flow

import path from 'path'
import fs from 'fs'
import runSeries from 'run-series'
import merge from 'webpack-merge'
import cleanApp from './commands/clean-app'
import webpackServer from './webpackServer'
import webpackBuild from './webpackBuild'
import {ErrBack} from './types'
import debug from './debug'
import {directoryExists} from './utils'


type AppConfig = {
  getName: () => string,
  getBuildDependencies: () => string[],
  getBuildConfig: () => Object,
  getServeConfig: () => Object,
};

// 默认的HTML模板路径
const DEFAULT_HTML_PATH = 'src/index.html'

// 创建一个构建，如果不可解析，首先安装任何所需的依赖项。
export function build(args: Object, appConfig: AppConfig, cb: ErrBack) {
  let dist = args._[2] || 'dist'

  let tasks = [
    (cb) => cleanApp({_: ['clean-app', dist]}, cb),
    (cb) => webpackBuild(
      `${appConfig.getName()} app`,
      args,
      () => createBuildConfig(args, appConfig.getBuildConfig()),
      cb
    ),
  ]

  let buildDependencies = appConfig.getBuildDependencies()
  if (buildDependencies.length > 0) {
    tasks.unshift((cb) => install(buildDependencies, {check: true}, cb))
  }

  runSeries(tasks, cb)

}

/**
 * 创建默认命令配置build一个应用程序并合并提供的任何额外的配置。
 */
export function createBuildConfig(args: Object, extra: Object = {}) {
  let entry = path.resolve(args._[1] || 'src/index.js')
  let dist = path.resolve(args._[2] || 'dist')

  let production = process.env.NODE_ENV === 'production'
  let filenamePattern = production ? '[name].[chunkhash:8].js' : '[name].js'

  let config: Object = {
    devtool: 'source-map',
    entry: {
      app: [entry],
    },
    output: {
      filename: filenamePattern,
      chunkFilename: filenamePattern,
      path: dist,
      publicPath: '/',
    },
    plugins: {
      html: args.html !== false && getDefaultHTMLConfig(),
      vendor: args.vendor !== false,
    },
  }

  if (directoryExists('public')) {
    config.plugins.copy = [{from: path.resolve('public'), to: dist, ignore: '.gitkeep'}]
  }

  return merge(config, extra)
}

export function createServeConfig(args: Object, ...extra: Object[]) {
  let entry = path.resolve(args._[1] || 'src/index.js')
  let dist = path.resolve(args._[2] || 'dist')


  let config: Object = {
    entry: [entry],
    output: {
      path: dist,
      filename: 'app.js',
      publicPath: '/',
    },
    plugins: {
      html: getDefaultHTMLConfig(),
    },
  }

  if (directoryExists('public')) {
    config.plugins.copy = [{from: path.resolve('public'), to: dist, ignore: '.gitkeep'}]
  }

  return merge(config, ...extra)
}

export function getDefaultHTMLConfig(cwd: string = process.cwd()) {
  // 如果存在，请使用默认的HTML模板路径
  if (fs.existsSync(path.join(cwd, DEFAULT_HTML_PATH))) {
    return {
      template: DEFAULT_HTML_PATH,
    }
  }
  // 否则为内部模板提供默认变量，以备返回。
  return {
    mountId: 'app',
    title: require(path.join(cwd, 'package.json')).name,
  }
}

// 运行一个开发者服务
export function serve(args: Object, appConfig: AppConfig, cb: ErrBack) {
  webpackServer(args, () => createServeConfig(args, appConfig.getServeConfig()), cb)
}

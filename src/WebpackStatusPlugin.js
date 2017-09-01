

import {clearConsole} from './utils'
import * as color from 'colors-cli/toxic'
import debug from './debug'
import {logErrorsAndWarnings} from './webpackUtils.js'

type StatusPluginOptions = {
  disableClearConsole?: boolean,
  quiet?: boolean,
  successMessage?: ?string,
};

/**
 * 显示构建Webpack的构建状态。
 */
export default class StatusPlugin {
  disableClearConsole: boolean; //是否清除命令行
  quiet: boolean;
  successMessage: ?string; // 提示消息
  isInitialBuild: boolean;
  constructor(options: StatusPluginOptions = {}) {
    let {
      disableClearConsole = false,
      quiet = false,
      successMessage = '',
    } = options

    this.disableClearConsole = disableClearConsole
    this.quiet = quiet
    this.successMessage = successMessage

    // 我们只想显示一次“开始...”消息
    this.isInitialBuild = true
  }
  clearConsole() {
    if (!this.quiet && !this.disableClearConsole) {
      clearConsole()
    }
  }

  apply(compiler: Object) {
    compiler.plugin('watch-run', this.watchRun)
    // compiler.plugin('watch-run', this.watchRun)
    compiler.plugin('done', this.done)
  }

  log(message: any) {
    if (!this.quiet) {
      console.log(message)
    }
  }

  watchRun = (compiler: Object, cb: ErrBack) => {
    // this.clearConsole()
    if (this.isInitialBuild) {
      this.log('Starting Webpack compilation...'.cyan)
      this.isInitialBuild = false
    }
    else {
      this.log('Recompiling...')
    }
    cb()
  }

  done = (stats: Object) => {
    // this.clearConsole()

    let hasErrors = stats.hasErrors()
    let hasWarnings = stats.hasWarnings()

    if (!hasErrors && !hasWarnings) {
      let time = stats.endTime - stats.startTime
      this.log(`Compiled successfully in ${time} ms.`.green)
    }
    else {
      // debug("WWWWWW",stats)
      logErrorsAndWarnings(stats)
      if (hasErrors) return
    }

    if (this.successMessage) {
      this.log('')
      this.log(this.successMessage)
    }
  }
}
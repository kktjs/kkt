import * as color from 'colors-cli/toxic'
import util from 'util'


let s = (n, w = ',s') => w.split(',')[n === 1 ? 0 : 1]


export class UserConfigReport {
  constructor(configPath) {
    this.configPath = configPath
    this.deprecations = []
    this.errors = []
    this.hints = []
  }
  hasErrors() {
    return this.errors.length > 0
  }
  error(path, value, message) {
    this.errors.push({path, value, message})
  }
  // 有多少错误要报告
  hasSomethingToReport() {
    return this.errors.length + this.deprecations.length + this.hints.length > 0
  }
  log() {
    console.log(`\n${'kkt'.cyan} config report for ${this.configPath.underline}`)
    console.log()
    if (!this.hasSomethingToReport()) {
      console.log(chalk.green(`${figures.tick} Nothing to report!`))
      return
    }
    if (this.errors.length) {
      let count = this.errors.length > 1 ? `${this.errors.length} ` : ''
      console.log(`${count}Error${s(this.errors.length)}`.red)
      console.log()
    }
    this.errors.forEach(({path, value, message}) => {
      console.log(`${`✖ ${path}`.red} ${'='.cyan} ${util.inspect(value).yellow}`)
      console.log(`  ${message}`)
      console.log()
    })
  }
}
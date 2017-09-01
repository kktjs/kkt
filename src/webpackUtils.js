
import * as color from 'colors-cli/toxic'
import {sync as gzipSize} from 'gzip-size'
import filesize from 'filesize'
import path from 'path'

const FRIENDLY_SYNTAX_ERROR_LABEL = 'Syntax error:'


let s = n => n === 1 ? '' : 's'

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      FRIENDLY_SYNTAX_ERROR_LABEL
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Webpack loader names obscure CSS filenames
    .replace(/^.*css-loader.*!/gm, '')
}
function isLikelyASyntaxError(message) {
  return message.includes(FRIENDLY_SYNTAX_ERROR_LABEL)
}
function formatMessages(messages, type) {
  return messages.map(
    message => `${type} in ${formatMessage(message)}`
  )
}

export function logErrorsAndWarnings(stats) {
  let json = stats.toJson({}, true)
  let formattedErrors = formatMessages(json.errors, ' ERROR '.white.red_b)
  if (stats.hasErrors()) {

    let errors = formattedErrors.length
    console.log(`Failed to compile with ${errors} error${s(errors)}.`.red)
    // console.log(color.red.bold.underline('hello'))
    if (formattedErrors.some(isLikelyASyntaxError)) {
      // 如果有任何语法错误，只显示它们。 
      // 这样可以避免在一个更有用的Babel语法错误之前发生混淆的ESLint解析错误。
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError)
    }
    formattedErrors.forEach(message => {
      console.log()
      console.log(message)
    })
  }
}


// 编译错误日志打印
export function logBuildResults(stats, spinner) {
  if (stats.hasErrors()) {
    if (spinner) {
      spinner.fail()
      console.log()
    }
    logErrorsAndWarnings(stats)
  }
  else if (stats.hasWarnings()) {
    if (spinner) {
      spinner.stopAndPersist(figures.warning.yellow)
      console.log()
    }
    logErrorsAndWarnings(stats)
    console.log()
    logGzippedFileSizes(stats)
  }
  else {
    if (spinner) {
      spinner.succeed()
      console.log()
    }
    logGzippedFileSizes(stats)
  }
}

function getFileDetails(stats) {
  let outputPath = stats.compilation.outputOptions.path
  return Object.keys(stats.compilation.assets)
    .filter(assetName => /\.(css|js)$/.test(assetName))
    .map(assetName => {
      let size = gzipSize(stats.compilation.assets[assetName].source())
      return {
        dir: path.dirname(path.join(path.relative(process.cwd(), outputPath), assetName)),
        name: path.basename(assetName),
        size,
        sizeLabel: filesize(size),
      }
    })
}

/**
 * 采取任意数量的Webpack Stats对象，并记录其包含的JS和CSS文件的gzip大小，最大。
 */
export function logGzippedFileSizes(...stats) {
  let files = stats.reduce((files, stats) => (files.concat(getFileDetails(stats))), [])
                   .filter(({name}) => !/^manifest\.[a-z\d]+\.js$/.test(name))

  let longest = files.reduce((max, {dir, name}) => {
    let length = (dir + name).length
    return length > max ? length : max
  }, 0)
  let pad = (dir, name) => Array(longest - (dir + name).length + 1).join(' ')

  console.log(`File size${s(files.length)} after gzip:`)
  console.log()

  files
    .sort((a, b) => b.size - a.size)
    .forEach(({dir, name, sizeLabel}) => {
      console.log(
        `  ${(`${dir}${path.sep}`).black_bbt}${name.cyan}` +
        `  ${pad(dir, name)}${sizeLabel.green}`
      )
    })

  console.log()
}

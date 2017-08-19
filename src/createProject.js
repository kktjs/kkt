
import path from 'path'
import {exec} from 'child_process'
import {UserError} from './errors'
import { PROJECT_TYPES ,APP_PROJECT_CONFIG} from './constants'
import pkg from '../package.json'
import runSeries from 'run-series' // 运行系列函数
import loading from 'loading-cli'
import copyTemplateDir from 'copy-template-dir'
import {install,directoryExists} from './utils'

// 最后一个版本号替换成 x , 当发生变化最后一个版本安装最新版本
const KKT_VERSION = pkg.version.split('.').slice(0, 2).concat('x').join('.')

// 验证用户提供的项目类型。
export function validateProjectType(projectType) {
  if (!projectType) {
    throw new UserError(`A project type must be provided, one of: ${[...PROJECT_TYPES].join(', ')}`)
  }
  if (!PROJECT_TYPES.has(projectType)) {
    throw new UserError(`Project type must be one of: ${[...PROJECT_TYPES].join(', ')}`)
  }
}

function initGit(args, cwd, cb) {
  // 如果git repo已经存在
  if (directoryExists(path.join(cwd, '.git'))) {
    return process.nextTick(cb)
  }

  exec('git --version', {cwd, stdio: 'ignore'}, (err) => {
    if (err) return cb()

    var st = loading("Initing Git repo").start()
    runSeries([
      (cb) => exec('git init', {cwd}, cb),
      (cb) => exec('git add .', {cwd}, cb),
      (cb) => exec(`git commit -m "Initial commit from kkt v${pkg.version}"`, {cwd}, cb),
    ], (err) => {
      if (err) {
        // st.stop()
        console.log(err.message.red)
        return cb()
      }
      st.succeed()
      // cb()
    })
  })
}

// 如果成功，复制项目模板并记录创建的文件。
function copyTemplate(templateDir, targetDir, templateVars, cb) {
  copyTemplateDir(templateDir, targetDir, templateVars, (err, createdFiles) => {
    if (err) return cb(err)
    createdFiles.sort().forEach(createdFile => {
      let relativePath = path.relative(targetDir, createdFile)
      console.log(`  ${'create'.green} ${relativePath}`)
    })
    cb()
  })
}

// 创建应用程序项目框架。
function createAppProject(args, projectType, name, targetDir, cb) {
  let {dependencies = []} = APP_PROJECT_CONFIG[projectType]
  if (dependencies.length !== 0) {
    let library = projectType.split('-')[0]
    if (args[library]) {
      dependencies = dependencies.map(pkg => `${pkg}@${args[library]}`)
    }
  }
  let templateDir = path.join(__dirname, `../templates/${projectType}`)
  let templateVars = {name,kktVersion:KKT_VERSION}
  runSeries([
    (cb) => copyTemplate(templateDir, targetDir, templateVars, cb),
    (cb) => install(dependencies, {cwd: targetDir, save: true}, cb),
    (cb) => initGit(args, targetDir, cb),
  ], cb)
}

export default function createProject(args, type, name, dir, cb) {
  if (type in APP_PROJECT_CONFIG) {
    return createAppProject(args, type, name, dir, cb)
  }else {

  }
}
// @flow
import fs from 'fs-extra'
import loading from 'loading-cli'
import runSeries from 'run-series' // 运行系列函数
import util from 'util'

// 检查目录是否存在。
export function directoryExists(dir: string): boolean {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}
/**
 * Log objects in their entirety so we can see everything in debug output.
 */
export function deepToString(object: Object): string {
  return util.inspect(object, {colors: true, depth: null})
}


/**
 * 检查给定的目录是否存在并过滤出任何不存在的目录。
 */
function checkDirectories(
  dirs: string[],
  cb: (?Error, existingDirs?: string[]) => void,
) {
  runSeries(
    dirs.map(dir => cb => fs.stat(dir, (err, stats) => {
      if (err) return cb(err.code === 'ENOENT' ? null : err)
      cb(null, stats.isDirectory() ? dir : null)
    })),
    (err, dirs) => {
      if (err) return cb(err)
      cb(null, dirs.filter(dir => dir != null))
    }
  )
}


/**
 * 如果存在任何给定的目录，请显示并将其删除。
 *
 * desc 描述正在清除的内容
 * dirs 删除的路径
 */
export function clean( desc: string, dirs: string[], cb) {
  checkDirectories(dirs, (err, dirs) => {
    if (err != null) return cb(err)
    if (dirs == null || dirs.length === 0) return cb()
    let spinner = loading(`Cleaning ${desc}`).start()
    runSeries(
      dirs.map(dir => cb => fs.remove(dir, cb)),
      (err) => {
        if (err) {
          spinner.fail()
          return cb(err)
        }
        spinner.succeed()
        cb()
      }
    )
  })
}


export function install(dependencies:string[],options,cb){
  let {
    cwd = process.cwd(),
    check = false,
    save= false
  } = options


  if (check) {
    dependencies = dependencies.filter(pkg => {
      // 假设：我们没有处理范围依赖，它以@
      let name = pkg.split('@')[0]
      try {
        resolve.sync(name, {basedir: cwd})
        return false
      }
      catch (e) {
        return true
      }
    })
  }

  if (dependencies.length === 0) {
    // 让这个cb在下一个事件轮询的时间点上执行。
    return process.nextTick(cb)
  }

}

// 清除控制台回滚。
export function clearConsole() {
  // 兼容Windows清楚命令行页面内容
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')
}

// 获取npm模块的路径。
export function modulePath(module: string, basedir: string = process.cwd()): string {
  return path.dirname(resolve.sync(`${module}/package.json`, {basedir}))
}

// 更好的类型返回
export function typeOf(o: any) {
  if (Number.isNaN(o)) return 'nan'
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
}


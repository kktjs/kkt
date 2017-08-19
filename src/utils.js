// @flow
import fs from 'fs-extra'

// 检查目录是否存在。
export function directoryExists(dir: string): boolean {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}

export function install(dependencies:string[],options,cb){
  let {
    cwd = process.cwd(),
    save= false
  } = options

  if (dependencies.length === 0) {
    // 让这个cb在下一个事件轮询的时间点上执行。
    return process.nextTick(cb)
  }

}
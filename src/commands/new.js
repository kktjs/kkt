import path from 'path'
import {newsError} from '../help'
import {UserError} from '../errors'
import {directoryExists} from '../utils'
import createProject,{validateProjectType} from '../createProject'

export default function(args, cb) {
  if (args._.length === 1) {
    return cb(new UserError(newsError))
  }

  let projectType = args._[1]
  try {
    // 验证项目类型是否存在
    validateProjectType(projectType)
  }catch (e) {
    return cb(e)
  }

  let name = args._[2]
  if (!name) {
    return cb(new UserError('\n A project name must be provided'))
  }
  if (directoryExists(name)) {
    return cb(new UserError(`A ${name}/ directory already exists`))
  }
  let targetDir = path.resolve(name);
  // 这个真是难以置信的想法
  let initialVowel = /^[aeiou]/.test(projectType)
  console.log(` Creating ${initialVowel ? 'an' : 'a'} ${projectType} project...`)

  createProject(args, projectType, name, targetDir, cb)
}
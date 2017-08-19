import parseArgs from 'minimist'
import {help,version} from './help'

export default function cli(argv,cb){
  let args = parseArgs(argv, {
    alias: {
      c: 'config',
      h: 'help',
      v: 'version',
    },
    boolean: ['help', 'version'],
  })

  let command = args._[0]
  // version 版本参数处理
  if (args.version || /^v(ersion)?$/.test(command)) {
    console.log(version)
    // 表示成功完成，回调函数中，err将为null；
    process.exit(0)
  }

  // help 参数处理
  if (args.help || !command || /^h(elp)?$/.test(command)) {
    console.log(help);
    process.exit(args.help || command ? 0 : 1)
  }
  // 命令不存在报错
  let unknownCommand = () => {
    console.error(`\n  ${'Unknown command:'.red} ${command.red}`)
    process.exit(1)
  }

  // 验证命令是否为foo-bar-baz格式，然后再尝试解析
  // 它的模块路径。
  // 这个是生成一个项目的格式，如 web-app，react-app
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(command)) {
    return unknownCommand()
  }

  let commandModulePath
  try {
    commandModulePath = require.resolve(`./commands/${command}`)
  }catch (e) {

  }

  if (commandModulePath == null) {
    return unknownCommand()
  }

  if (/^(clean|test)/.test(command)) {

  }

  // 命令存在加载执行它
  // 回到 babel5 时候的表现
  // https://www.npmjs.com/package/babel-plugin-add-module-exports
  let commandModule = require(commandModulePath)
  if (typeof commandModule === 'function') {
    commandModule(args, cb)
  }

}
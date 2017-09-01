import getUserConfig from './getUserConfig'
import createWebpackConfig from './createWebpackConfig'
import type {ServerConfig} from './types'
import debug from './debug'

// 为要订阅Hot Module Replacement更新的客户端创建Webpack条目配置。
function getHMRClientEntries(args: Object, serverConfig: ?ServerConfig): string[] {
  // null config表示我们正在创建用于Express中间件的配置，
  // 用于HMR的webpack-hot-middleware
  if (serverConfig == null) {
    let hotMiddlewareOptions = args.reload ? '?reload=true' : ''
    return [
      // Polyfill EventSource for IE，作为webpack-hot-middleware / client使用它
      require.resolve('eventsource-polyfill'),
      require.resolve('webpack-hot-middleware/client') + hotMiddlewareOptions,
    ]
  }
  // 否则，我们使用webpack-dev-server客户端
  let hmrURL = '/'
  // 如果用户自定义它，请设置完整的HMR URL
  if (args.host || args.port) {
    hmrURL = `http://${serverConfig.host || 'localhost'}:${serverConfig.port}/`
  }

  return [
    require.resolve('webpack-dev-server/client') + `?${hmrURL}`,
    require.resolve(`webpack/hot/${args.reload ? '' : 'only-'}dev-server`),
  ]
}

// 创建Webpack配置，为热模块更换提供监听构建。
export default function createServerWebpackConfig(
  args: Object,
  commandConfig: Object,
  serverConfig: ?ServerConfig,
) {
  let userConfig = getUserConfig(args, {/*pluginConfig*/})

  let {entry, plugins = {}, ...otherCommandConfig} = commandConfig

  if (args['auto-install'] || args.install) {
    plugins.autoInstall = true
  }

  /**
   * 
   * sourcemap 有 7 种，太难了搞不清楚是什么鬼
   *  
   * eval 文档上解释的很明白，每个模块都封装到 eval 包裹起来，并在后面添加 //# sourceURL
   * source-map 这是最原始的 source-map 实现方式，其实现是打包代码同时创建一个新的 sourcemap 文件， 并在打包文件的末尾添加 //# sourceURL 注释行告诉 JS 引擎文件在哪儿
   * hidden-source-map 文档上也说了，就是 soucremap 但没注释，没注释怎么找文件呢？貌似只能靠后缀，譬如 xxx/bundle.js 文件，某些引擎会尝试去找 xxx/bundle.js.map
   * inline-source-map 为每一个文件添加 sourcemap 的 DataUrl，注意这里的文件是打包前的每一个文件而不是最后打包出来的，同时这个 DataUrl 是包含一个文件完整 souremap 信息的 Base64 格式化后的字符串，而不是一个 url。
   * eval-source-map 这个就是把 eval 的 sourceURL 换成了完整 souremap 信息的 DataUrl
   * cheap-source-map 不包含列信息，不包含 loader 的 sourcemap，（譬如 babel 的 sourcemap）
   * cheap-module-source-map 不包含列信息，同时 loader 的 sourcemap 也被简化为只包含对应行的。最终的 sourcemap 只有一份，它是 webpack 对 loader 生成的 sourcemap 进行简化，然后再次生成的。
   * 
   * webpack 不仅支持这 7 种，而且它们还是可以任意组合的，就如文档所说，你可以设置 souremap 选项为 cheap-module-inline-source-map。
   */
  return createWebpackConfig({
    server: true,
    devtool: 'cheap-module-source-map',
    entry: getHMRClientEntries(args, serverConfig).concat(entry),
    plugins,
    ...otherCommandConfig,
  }, {/*pluginConfig*/}, userConfig)
}

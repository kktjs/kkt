// @flow
import path from 'path'
import webpack, {optimize} from 'webpack'
import merge from 'webpack-merge'
import Config from 'webpack-config';
import CopyPlugin from 'copy-webpack-plugin'
import debug from './debug'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlPlugin from 'html-webpack-plugin'
import createBabelConfig from './createBabelConfig'
import {typeOf} from './utils'
import StatusPlugin from './WebpackStatusPlugin'

type RuleConfig = {
  test?: RegExp,
  include?: RegExp,
  exclude?: RegExp,
  loader?: string,
  options?: Object,
  use?: UseConfig
};

const DEFAULT_UGLIFY_CONFIG = {
  compress: {
    warnings: false,
  },
  output: {
    comments: false,
  },
  sourceMap: true,
}

/**
 * 代码压缩配置生成
 */
function createUglifyConfig(userPluginConfig) {
  if (userPluginConfig.debug) {
    return merge(
      {...DEFAULT_UGLIFY_CONFIG, beautify: true, mangle: false},
      // 保留用户'compress'配置（如果存在），因为它会影响从生成构建中删除的内容。
      typeof userPluginConfig.uglify === 'object' && 'compress' in userPluginConfig.uglify
        ? {compress: userPluginConfig.uglify.compress}
        : {}
    )
  }
  return merge(
    DEFAULT_UGLIFY_CONFIG,
    typeof userPluginConfig.uglify === 'object' ? userPluginConfig.uglify : {}
  )
}


/**
 * HtmlPlugin插件，它插入一个提取的Webpack列表的内容
 * 在其他发射的asssets注入之前，
 * 在<script>标签中的HTML中  HtmlPlugin本身。
 */
function injectManifestPlugin() {
  this.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (data, cb) => {
      Object.keys(compilation.assets).forEach(key => {
        if (!key.startsWith('manifest.')) return
        let {children} = compilation.assets[key]
        if (children && children[0]) {
          data.html = data.html.replace(
            /^(\s*)<\/body>/m,
            `$1<script>${children[0]._value}</script>\n$1</body>`
          )
          // 从HtmlPlugin的资产中删除清单，以防止为其创建<script>标签。
          var manifestIndex = data.assets.js.indexOf(data.assets.publicPath + key)
          data.assets.js.splice(manifestIndex, 1)
          delete data.assets.chunks.manifest
        }
      })
      cb(null, data)
    })
  })
}

function getCopyPluginArgs(buildConfig, userConfig) {
  let patterns = []
  let options = {}
  if (buildConfig) {
    patterns = patterns.concat(buildConfig)
  }
  if (userConfig) {
    patterns = patterns.concat(userConfig.patterns || [])
    options = userConfig.options || {}
  }
  return [patterns, options]
}

/**
 * 最终webpack插件配置包括：
 * - 基于是否正在配置服务器构建，由此功能创建的默认插件集，无论构建是针对应用程序（将为其生成HTML）还是环境变量。
 * - 由此功能管理的额外的插件，其包含由构建配置触发，为配置提供默认配置，可在适当时由用户插件配置进行调整。
 * - 在构建和用户配置中定义的任何额外的插件（额外的用户插件不在这里处理，而是通过webpack.extra配置的最终合并）。
 */
export function createPlugins(
  server: boolean,
  buildConfig: Object = {},
  userConfig: Object = {}
) {
  let development = process.env.NODE_ENV === 'development'
  let production = process.env.NODE_ENV === 'production'

  let plugins = [
    // 强制执行区分大小写的导入路径
    new CaseSensitivePathsPlugin(),
    // 用值替换指定的表达式
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      ...buildConfig.define,
      ...userConfig.define,
    }),
  ];

  // debug('server::server:::',server)
  // debug('server::buildConfig.status:::',buildConfig.status)
  if (server) {
    // HMR默认启用，但可以显式禁用
    if (server.hot !== false) {
      plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
      )
    }
    if (buildConfig.status) {
      plugins.push(new StatusPlugin(buildConfig.status))
    }
    // 使用路径作为名称
    plugins.push(new webpack.NamedModulesPlugin())
  }else{
    // 如果我们不服务，我们正在创建一个静态构建
    if (userConfig.extractText !== false) {
      // 将导入的样式表提取到.css文件中
      plugins.push(new ExtractTextPlugin({
        allChunks: true,
        filename: production ? `[name].[contenthash:8].css` : '[name].css',
        ...userConfig.extractText,
      }))
    }
    
    // 启用时，将从node_modules /导入的模块移动到供应商块中
    if (buildConfig.vendor) {
      plugins.push(new optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module, count) {
          return (
            module.resource &&
            module.resource.includes('node_modules')
          )
        }
      }))
    }

    // 如果我们生成一个HTML文件，我们必须构建一个Web应用程序，因此可以配置确定性哈希长期缓存。
    if (buildConfig.html) {
      plugins.push(
        // 生成稳定的模块ID而不是使用Webpack分配整数。 
        // NamedModulesPlugin允许更容易的调试，并且HashedModuleIdsPlugin不添加太多的捆绑大小。
        (development || userConfig.debug)
          // 当插入HMR时，此插件将导致显示模块的相对路径。 建议用于开发。
          ? new webpack.NamedModulesPlugin() 
          // 这个插件会使哈希值基于模块的相对路径，生成一个四个字符的字符串作为模块id。 建议用于生产。
          : new webpack.HashedModuleIdsPlugin(),
        // Webpack清单通常被折叠到最后一个块，改变其哈希
        // 通过将清单提取到自己的块中来防止这一点 
        // 对确定性散列也是至关重要的。
        new optimize.CommonsChunkPlugin({name: 'manifest'}),
        // 将Webpack清单注入生成的HTML作为<script>
        injectManifestPlugin,
      )
    }

  }


  if (production) {
    plugins.push(new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }))

    if (userConfig.uglify !== false) {
      plugins.push(new optimize.UglifyJsPlugin(createUglifyConfig(userConfig)))
    }

    //使用部分范围hoisting/module连接
    if (userConfig.hoisting) {
      plugins.push(new optimize.ModuleConcatenationPlugin())
    }
  }

  // 为产生资源的网路应用程式生成HTML档案
  if (buildConfig.html) {
    plugins.push(new HtmlPlugin({
      chunksSortMode: 'dependency',
      template: path.join(__dirname, '../templates/webpack-template.html'),
      ...buildConfig.html,
      ...userConfig.html,
    }))
  }

  // 拷贝今天资源目录
  // 这是一个Webpack插件，可以将单个文件或整个目录复制到构建目录中。
  if (buildConfig.copy) {
    plugins.push(new CopyPlugin(
      ...getCopyPluginArgs(buildConfig.copy, userConfig.copy)
    ))
  }

  // 在生成的文件的顶部插入横幅注释 - 用于UMD构建
  if (buildConfig.banner) {
    plugins.push(new webpack.BannerPlugin({banner: buildConfig.banner}))
  }


  return plugins;
}

/**
 * 添加Polyfills 到entry 里面
 */
function addPolyfillsToEntry(entry) {
  let polyfills = require.resolve('../polyfills')
  if (typeOf(entry) === 'array') {
    entry.unshift(polyfills)
  } else {
    // 假设：只有一个入口点，命名入口块
    entry[Object.keys(entry)[0]].unshift(polyfills)
  }
}

/**
 * 验证默认配置
 */
export function getDefaultRulesKey(rule:Object = {}){
  let key = ''
  switch(RegExp(rule.test).source){
    case "\\.(gif|png|webp)$":key='graphics';break;
    case "\\.js$":key='js';break;
    case "\\.jpe?g$":key='jpeg';break;
    case "\\.svg$":key='svg';break;
    case "\\.(eot|otf|ttf|woff|woff2)$":key='fonts';break;
    case "\\.(mp4|ogg|webm)$":key='video';break;
    case "\\.(wav|mp3|m4a|aac|oga)$":key='audio';break;
  }
  return key;
}

/**
 * 验证默认配置对应的 key
 */
export function isDefaultRuleKeys(ruleKey:String = ''){
  return ["graphics","js", "svg", "jpeg", "fonts", "video", "audio"].indexOf(ruleKey) > -1
}

/** 
 * 创建一个webpack配置，其中包含适合创建静态构建（默认）或热重新加载的应用程序的默认规则。
 */
export default function createWebpackConfig(
  buildConfig: Object,
  pluginConfig: Object = {},
  userConfig: Object = {}
): Object {
  let {
    //这些构建配置项用于创建大量的webpack配置，
    //而不是按原样包含。
    babel: buildBabelConfig = {},
    entry,
    output: buildOutputConfig,
    polyfill: buildPolyfill,
    plugins: buildPluginConfig = {},
    resolve: buildResolveConfig = {},
    rules: buildRulesConfig = {},
    server = false,
    //提供的任何其他构建配置直接合并到最终的webpack中
    // config提供其余的默认配置。
    ...otherBuildConfig
  } = buildConfig

  let userWebpackConfig = userConfig.webpack || {}
  let userOutputConfig = {}
  if ('publicPath' in userWebpackConfig) {
    userOutputConfig.publicPath = userWebpackConfig.publicPath
  }
  let userResolveConfig = {}
  if (userWebpackConfig.aliases) {
    userResolveConfig.alias = userWebpackConfig.aliases
  }

  // 为babel-loader生成配置，并将其设置为构建的加载程序配置
  let babelConfig = {options: createBabelConfig(buildBabelConfig, userConfig.babel)}
  let webpackConfig = new Config().extend({[`${path.join(__dirname,'webpack.default.conf.js')}`]: config => {
    // 默认rules 配置，和自定义配置
    config.module.rules = config.module.rules.map((item,idx)=>{
      let keyName = getDefaultRulesKey(item);
      if(userWebpackConfig.rules[keyName] === false){
        return null
      }else if(keyName === 'js'){
        item.options = {...item.options,...babelConfig.options}
        return item
      }else if(userWebpackConfig.rules[keyName]){
        return userWebpackConfig.rules[keyName]
      }else {
        return item
      }
    })
    .filter(rule => rule != null);
    return config
  }} ).merge({
    module:{
      "strictExportPresence": true,
    },
    output: {
      ...buildOutputConfig,
      ...userOutputConfig,
    },
    plugins:createPlugins(server, buildPluginConfig, userWebpackConfig),
    resolve: merge( {extensions: ['.js', '.json']}, buildResolveConfig, userResolveConfig),
    ...otherBuildConfig,
  })


  webpackConfig.resolve.modules = ['node_modules', path.join(__dirname, '../node_modules')];
  // debug("webpack config entry: ",JSON.stringify(entry,null,2))


  if (entry) {
    // 将默认polyfill填充添加到entry，除非配置不存在
    if (buildPolyfill !== false && userConfig.polyfill !== false) {
      // addPolyfillsToEntry(entry)
    }
    webpackConfig.entry = entry
  }
  // 要添加一个不由 `kkt` 自己的webpack.rules`配置管理的额外规则，
  // 您需要在 `webpack.extra.module.rules` 中提供一个规则列表。
  if (userWebpackConfig.extra) {
    webpackConfig = merge(webpackConfig, userWebpackConfig.extra)
  }

  return webpackConfig

}
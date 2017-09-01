配置
---

默认根目录下的 `kkt.config.js` 配置项

```js
module.exports = {
  type: 'web-app',
  webpack: {
    autoprefixer: '> 1%, last 2 versions, Firefox ESR, ios >= 8',
    rules:{}
  }
}
```

## kkt 配置

目前可以生产 `web-app` 项目

### polyfill

对于应用程序，`kkt` 仅默认提供项目仅包括几个ES6 polyfills： 

- [Object.assign()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 通过 [object-assign](https://github.com/sindresorhus/object-assign)。
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 通过 [promise](https://github.com/then/promise)
- [fetch()](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) 通过 [whatwg-fetch](https://github.com/github/fetch)。


要禁用此功能，请将`polyfill` 设置为`false`：

```js
module.exports = {
  polyfill: false
}
```

## webpack配置

### 默认Rules配置

- `babel` - 处理 `.js` 文件使用 [babel-loader][babel-loader]

  > 默认配置: `{exclude: /node_modules/, options: {babelrc: false, cacheDirectory: true}}`

- `graphics` - 处理 `.gif`, `.png` 和 `.webp` 文件使用 [url-loader][url-loader]
- `svg` - 处理 `.svg` 文件使用 [url-loader][url-loader]
- `jpeg` - 处理 `.jpg` 和 `.jpeg` 文件使用 [url-loader][url-loader]
- `fonts` - 处理 `.eot`, `.otf`, `.ttf`, `.woff` 和 `.woff2` 文件使用 [url-loader][url-loader]
- `video` - 处理 `.mp4`, `.ogg` 和 `.webm` 文件使用 [url-loader][url-loader]
- `audio` - 处理 `.wav`, `.mp3`, `.m4a`, `.aac`, 和 `.oga` 文件使用 [url-loader][url-loader]
- `js` - 处理 `.js` 文件使用 [babel-loader][babel-loader]
 
> 所有url-loader的默认配置为 `{options: {limit: 1, name: '[name].[hash:8].[ext]'}}`  
> 设置 `graphics=false` 不适用默认配置

上面是一些默认配置，可以自定义一些 rules，可以覆盖默认配置。

```js
module.exports = {
  type: 'web-app',
  webpack: {
    autoprefixer: '> 1%, last 2 versions, Firefox ESR, ios >= 8',
    rules:{
      jpeg:false,
      video:false,
      graphics:false,
      fonts:{ 
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        name:"fonts",
        options: { 
          limit: 1, 
          name: '[name].[hash:8].[ext]' 
        } 
      }
    }
  }
}
```

### define

默认情况下，`kkt`将使用Webpack的[`DefinePlugin`](https://webpack.js.org/plugins/define-plugin/) 将所有出现的`process.env.NODE_ENV`替换为包含`NODE_ENV`的字符串 当前值。

您可以配置一个`define`对象来添加你自己的常量值。例如 用`__VERSION__`替换所有出现的`__VERSION__`，包含你的应用程序版本的

```js
module.exports = {
  webpack: {
    define: {
      __VERSION__: JSON.stringify(require('./package.json').version)
    }
  }
}
```

### extra

使用 [webpack-merge](https://github.com/survivejs/webpack-merge#webpack-merge---merge-designed-for-webpack) 将额外的配置合并到生成的Webpack配置中 - 请参阅 [Webpack配置](https://webpack.js.org/configuration/)。

要添加一个不由 `kkt` 自己的`webpack.rules`配置管理的额外规则，您需要在 `webpack.extra.module.rules` 中提供一个规则列表。在 `webpack。rules` 中定义也是可以的

```js
var path = require('path')

module.exports = function(kkt) {
  return {
    type: 'react-app',
    webpack: {
      extra: {
        // 添加不受kkt管理的额外规则的示例，
        // 假设你在你的项目中安装了html-loader。
        module: {
          rules: [
            {test: /\.html$/, loader: 'html-loader'}
          ]
        },
        // 添加不受kkt管理的额外插件的示例
        plugins: [
          new kkt.webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 1024
          })
        ]
      }
    }
  }
}
```

## 开发模式的配置

`kkt`使用[Webpack Dev Server](https://github.com/webpack/webpack-dev-server#readme) 为应用程序提供开发 - 您可以调整`kkt`使用的选项，并启用其他功能。

### devServer

`Webpack Dev Server`的配置 - 有关可用选项，请参阅`Webpack`的[`devServer`配置文档](https://webpack.js.org/configuration/dev-server/#devserver)。

提供的任何`devServer`选项将被合并在以下默认选项之上`kkt`使用：

```js
{
  historyApiFallback: true,
  hot: true,
  noInfo: true,
  overlay: true,
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
}
```

您可以使用以下选项配置这些的功能：

- [`devServer.historyApiFallback`]（https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback） - 配置`disableDotRule`，如果您在使用HTML5历史记录API时需要在路径中使用点。
- [`devServer.https`]（https://webpack.js.org/configuration/dev-server/#devserver-https） - 启用具有默认自签名证书的HTTPS，或提供您自己的证书。
- [`devServer.overlay`]（https://webpack.js.org/configuration/dev-server/#devserver-overlay） - 禁用编译错误重叠，或者也出现警告。
- [`devServer.proxy`]（https://webpack.js.org/configuration/dev-server/#devserver-proxy） - 将某些URL代理到单独的API后端开发服务器。
- [`devServer.setup`]（https://webpack.js.org/configuration/dev-server/#devserver-setup） - 访问Express应用程序以将自己的中间件添加到dev服务器。

例如 启用HTTPS：

```js
module.exports = {
  devServer: {
    https: true
  }
}
```









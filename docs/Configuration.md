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

## Babel

<details>
<summary>babel</summary>

> 可以使用以下属性在Babel对象中提供Babel配置。

</details>

<details>
<summary>babel.cherryPick - 启用cherry-pick只有你用到的那部分代码会被最终打包</summary>

> 此功能仅在您使用导入语法时有效。
> 如果导入模块里面相关模块，整个模块通常会包含在构建中，即使您只使用特定的部分：

```js
import {Button, Model, Tag} from 'uiw'
```

> 上面的解决方法，通常是单独导入子模块，这在你代码中是繁琐的，如下：

```js
import Button from 'uiw/lib/button'
import Model from 'uiw/lib/model'
import Tag from 'uiw/lib/tag'
```

> 如果您使用`cherryPick`配置，您可以像第一个示例一样编写代码，但是通过指定要将cherryPick应用到的模块名称，可以转换为与第二个例子相同的代码：

```js
module.exports = {
  babel: {
    cherryPick: 'uiw'
  }
}
```

> 这是使用[babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)实现的 - 请检查其问题与您正在使用cherryPick的模块的兼容性问题并报告您找到的任何新的模块。

</details>


<details>
<summary>babel.loose - 启用支持它的Babel插件的松散模式</summary>

> 一些Babel插件具有[松散的模式](http://www.2ality.com/2015/12/babel6-loose-mode.html)，它们输出更简单，潜在更快的代码，而不是严格遵循ES6规范的语义。
> 
> `默认启用松散模式`。
> 
> 如果要禁用松散模式（例如，为了检查您的代码是否在更严格的正常模式下工作以实现远程兼容性），请将其设置为false。例如 仅在运行测试时禁用松开模式：

```js
module.exports = {
  babel: {
    loose: process.env.NODE_ENV === 'test'
  }
}
```

</details>


<details>
<summary>babel.plugins - 使用额外的Babel插件</summary>

> 参数 `plugins` 可以指定为一个字符串，或者使用多个插件使用数组。例如：安装使用 [babel-plugin-react-html-attrs](https://github.com/insin/babel-plugin-react-html-attrs#readme) 插件

```bash
npm install babel-plugin-react-html-attrs
```

```js
module.exports = {
  babel: {
    plugins: 'react-html-attrs'
  }
}
```

</details>


<details>
<summary>babel.presets - 使用额外的Babel预设</summary>

> 参数 `presets` 可以指定为一个字符串，或者使用多个Babel预设使用数组。

</details>


<details>
<summary>babel.removePropTypes - 禁用或配置在生产构建中删除React组件propTypes</summary>

> 此功能通过[react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types)实现，设置为false以禁止使用此转换：

```js
module.exports = {
  babel: {
    removePropTypes: false,
  }
}
```

> [transform](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types#options)，提供一个配置对象

```
module.exports = {
  babel: {
    removePropTypes: {
      // 删除'prop-types'模块的导入
      // 如果您只使用该模块作为支持类型，则只能安全启用
      removeImport: true
    },
  }
}
```

</details>


<details>
<summary>babel.reactConstantElements - 禁用在生产构建中使用React常数元素提升</summary>

> [React constant elements transformer](https://babeljs.io/docs/plugins/transform-react-constant-elements/)

</details>


<details>
<summary>babel.runtime - 启用具有不同配置的transform-runtime插件</summary>

> 默认情况下，Babel的[runtime transform](https://babeljs.io/docs/plugins/transform-runtime/)有3件事情：
> 
> 1. 从babel-runtime导入辅助模块。
> 2. 在您的代码中使用新的ES6内置（`Promise`）和静态方法（例如`Object.assign`）时，导入本地`polyfill`。
> 3. 导入在需要时使用 `async`/`await` 所需的再生器运行时。

> 默认配置将重新启动运行时导入，以便您可以使用 `async`/`await` 和 `generator`。要启用其他功能，您可以命名（`'helpers'`或`'polyfill'`）：

```js
module.exports = {
  babel: {
    runtime: 'helpers'
  }
}
```

> 要启用所有功能，请将`runtime`设置为`true`。
> 要禁用使用运行时转换，请将`runtime`设置为`false`。

</details>


<details>
<summary>babel.stage - 控制可以使用哪些实验和即将到来的JavaScript功能</summary>

> 默认情况下启用 stage-2 - 完全禁用`stage`预设的使用，将`stage`设置为`false`：

```js
module.exports = {
  babel: {
    stage: 1
  }
}
```

</details>


## Webpack配置


<details>
<summary>webpack.rules - 默认Rules配置</summary>


> - `babel` - 处理 `.js` 文件使用 [babel-loader](https://github.com/babel/babel-loader)
> - `graphics` - 处理 `.gif`, `.png` 和 `.webp` 文件使用 [url-loader](https://github.com/webpack-contrib/url-loader)
> - `svg` - 处理 `.svg` 文件使用 [url-loader](https://github.com/webpack-contrib/url-loader)
> - `jpeg` - 处理 `.jpg` 和 `.jpeg` 文件使用 [url-loader](https://github.com/webpack-contrib/url-loader)
> - `fonts` - 处理 `.eot`, `.otf`, `.ttf`, `.woff` 和 `.woff2` 文件使用 [url-loader](https://github.com/> webpack-contrib/url-loader)
> - `video` - 处理 `.mp4`, `.ogg` 和 `.webm` 文件使用 [url-loader](https://github.com/webpack-contrib/url-loader)
> - `audio` - 处理 `.wav`, `.mp3`, `.m4a`, `.aac`, 和 `.oga` 文件使用 [url-loader](https://github.com/webpack-contrib/url-loader)
> 
> 所有url-loader的默认配置为 `{options: {limit: 1, name: '[name].[hash:8].[ext]'}}`  
> 设置 `graphics=false` 不适用默认配置
> babel默认配置: `{exclude: /node_modules/, options: {babelrc: false, cacheDirectory: true}}`

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

</details>


<details>
<summary>webpack.define - DefinePlugin的选项，用于用值替换某些表达式</summary>

> 默认情况下，`kkt`将使用Webpack的[`DefinePlugin`](https://webpack.js.org/plugins/define-plugin/) 将所有出现的`process.env.NODE_ENV`替换为包含`NODE_ENV`的字符串 当前值。

> 您可以配置一个`define`对象来添加你自己的常量值。例如 用`__VERSION__`替换所有出现的`__VERSION__`，包含你的应用程序版本的

```js
module.exports = {
  webpack: {
    define: {
      __VERSION__: JSON.stringify(require('./package.json').version)
    }
  }
}
```

</details>


<details>
<summary>webpack.extra - 一个用于额外的Webpack的配置，它将被合并到生成的配置中</summary>

> 使用 [webpack-merge](https://github.com/survivejs/webpack-merge#webpack-merge---merge-designed-for-webpack) 将额外的配置合并到生成的Webpack配置中 - 请参阅 [Webpack配置](https://webpack.js.org/configuration/)。
> 
> 要添加一个不由 `kkt` 自己的`webpack.rules`配置管理的额外规则，您需要在 `webpack.extra.module.rules` 中提供一个规则列表。在 `webpack。rules` 中定义也是可以的

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

</details>




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

- [`devServer.historyApiFallback`](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback) - 配置`disableDotRule`，如果您在使用HTML5历史记录API时需要在路径中使用点。
- [`devServer.https`](https://webpack.js.org/configuration/dev-server/#devserver-https) - 启用具有默认自签名证书的HTTPS，或提供您自己的证书。
- [`devServer.overlay`](https://webpack.js.org/configuration/dev-server/#devserver-overlay) - 禁用编译错误重叠，或者也出现警告。
- [`devServer.proxy`](https://webpack.js.org/configuration/dev-server/#devserver-proxy) - 将某些URL代理到单独的API后端开发服务器。
- [`devServer.setup`](https://webpack.js.org/configuration/dev-server/#devserver-setup) - 访问Express应用程序以将自己的中间件添加到dev服务器。

例如 启用HTTPS：

```js
module.exports = {
  devServer: {
    https: true
  }
}
```









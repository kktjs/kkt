kkt
--- 

Create React apps with no build configuration, Cli tool for creating react apps.

![](./kkt.gif)

## 安装

```bash
npm install -g kkt
```

## 初始化一个项目

目前工程自带实例，在创建项目的时候可以选择。

```bash
$ kkt create my-app

❯  react + react-dom
   react + router + redux
   react + router + redux + uiw
```

选择项目之后，将自动安装依赖，完成之后直接进入项目，运行自动开启浏览器预览。

```bash
$ cd my-project && npm start
```

## 命令帮助

```bash
Usage: kkt <command> [options]

Rapid React development, Cli tool for creating react apps.

Options:

  -v, --version                output the version number
  -h, --help                   output usage information

Commands:

  create [options] <app-name>  create a new project powered by kkt
  build                        Builds the app for production to the dist folder.
  start                        Runs the app in development mode.
  deploy [options]             Push the specified directory to the gh-pages branch.

Examples:

  $ kkt start
  $ kkt build
```

## Webpack 配置修改

在根目录新建 `mocker/index.js` 这里返回两个参数 `WebpackConf` 和 `devServer`，返回的是 `webpack` 配置，webpack 配置，区分开发模式和生成模式，是通过 `WebpackConf.mode` 的值为 `development | production` 来判断;

<details>
<summary>配置文件 mocker/index.js 简单实例</summary>

```js
module.exports = function (WebpackConf, devServer) {
  if (WebpackConf) {
    if (WebpackConf.mode === 'development') {
      // 开发模式下更改的 webpack 配置
    }
    if (WebpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
    }
    return WebpackConf
  };
  if (devServer) {
    devServer.proxy = {
      '/api': {
        target: 'http://127.0.0.1:1130',
        changeOrigin: true,
      },
    }
    return devServer;
  }
}
```

</details>



### Rules 配置修改

修改替换其中的 `Rules`，这里有 [默认Webpack配置](./conf)，你可以根据默认配置进行替换和删除，好复杂哦。


<details>
<summary>WebpackConf.rules - 默认Rules配置</summary>


- `babel` - 处理 `.js` 文件使用 [babel-loader](https://github.com/babel/babel-loader)  
- `graphics` - 处理 `.gif`, `.png` 和 `.webp` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)
- `svg` - 处理 `.svg` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)
- `jpeg` - 处理 `.jpg` 和 `.jpeg` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)
- `fonts` - 处理 `.eot`, `.otf`, `.ttf`, `.woff` 和 `.woff2` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)
- `video` - 处理 `.mp4`, `.ogg` 和 `.webm` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)
- `audio` - 处理 `.wav`, `.mp3`, `.m4a`, `.aac`, 和 `.oga` 文件使用 [file-loader](https://github.com/webpack-contrib/file-loader)

> 
> 所有 `file-loader` 的默认配置为 `{ name: 'static/[name].[hash:8].[ext]' }`  
> babel默认配置: `{ loader: require.resolve('babel-loader'), options: require('../.babelrc'), // eslint-disable-line }`

</details>


<details>
<summary>修改默认Rules配置</summary>

下面实例是通过 `.kktrc.js` 文件去修改 `Webpack Rules`, 这个实例修改默认规则 `/\.(css|less)$/` 样式处理`loader` 配置，引用 [uiw](https://uiw-react.github.io/) 组件库之后, 由于默认开启 [css-modules](https://github.com/css-modules/css-modules) 导致组件库里面的样式名字被处理了，样式展示不出来，下面实例 [css-modules](https://github.com/css-modules/css-modules) 过滤 [uiw](https://uiw-react.github.io/) 里面的所有 `className` 都不做处理。

```js
module.exports = function (WebpackConf, devServer) {
  if (WebpackConf) {
    WebpackConf.module.rules.map((item) => {
      if (item.oneOf) {
        item = item.oneOf.map((childItem) => {
          // kkt@1.9.23+ less 和 CSS 配置 分开
          // 之前的配置判断需要 String(/\.(css|less)$/)
          if (String(/\.(less)$/) === String(childItem.test)) {
            childItem.use = childItem.use.map((_childItem) => {
              if (/node_modules\/css-loader/.test(_childItem.loader)) {
                // 这里将 css-loader 配置替换了重新配置
                _childItem = {
                  loader: require.resolve('css-loader'),
                  options: {
                    root: '.',
                    modules: true,
                    // minimize: true,
                    localIdentName: '[local]',
                    importLoaders: 1,
                    getLocalIdent: (context, localIdentName, localName) => {
                      // 过滤 uiw 组件库，因为 modules=true 参数，会将 className替换成Hash，导致uiw样式无法加载
                      const hash = loaderUtils.getHashDigest(context.resourcePath + localIdentName, 'md5', 'base64', 5);
                      const uiwpath = path.join(process.cwd(), 'node_modules', 'uiw');
                      if ((new RegExp(`^${uiwpath}`)).test(context.resourcePath)) {
                        return localName;
                      }
                      return localName + hash;
                    },
                  },
                }
              }
              return _childItem;
            });
          }
          return childItem;
        });
      }
      return item;
    });

    if (WebpackConf.mode === 'development') {
      // 开发模式下更改的 webpack 配置
    }
    if (WebpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
    }
    return WebpackConf
  };
}
```

</details>


## 开发模式的配置

`kkt`使用 [Webpack Dev Server](https://github.com/webpack/webpack-dev-server#readme) 为应用程序提供开发 - 您可以调整`kkt`使用的选项，并启用其他功能。

### devServer

<details>
<summary>devServer - 默认配置</summary>

`Webpack Dev Server` 的配置 - 有关可用选项，请参阅 `Webpack` 的 [devServer配置文档](https://webpack.js.org/configuration/dev-server/#devserver)。

提供的任何 `devServer` 选项将被合并在以下默认选项之上`kkt`使用（[webpack.config.server.js](./conf/webpack.config.server.js)）：

```js
const FS = require('fs');
const PATH = require('path');
const apiMocker = require('webpack-api-mocker');
const paths = require('./path');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

module.exports = (webpackConf) => {
  const serverConf = {
    // 启用生成文件的gzip压缩。
    compress: true,
    // 沉默WebpackDevServer自己的日志，因为它们通常没有用处。
    // 这个设置仍然会显示编译警告和错误。
    clientLogLevel: 'none',
    publicPath: webpackConf.output.publicPath,
    hot: true,
    historyApiFallback: {
      // 带点的路径仍应使用历史回退。
      disableDotRule: true,
    },
    // historyApiFallback: true,
    // WebpackDevServer默认是嘈杂的，所以我们发出自定义消息
    // 通过上面的`compiler.plugin`调用来监听编译器事件。
    quiet: true,
    // 如果HTTPS环境变量设置为“true”，则启用HTTPS
    https: protocol === 'https',
    // 告诉服务器从哪里提供内容。提供静态文件，这只是必要的。
    contentBase: [paths.appDirectory],
    // 通知服务器观察由devServer.contentBase选项提供的文件。
    // 文件更改将触发整页重新加载。
    watchContentBase: true,
    // 这样可以避免某些系统的CPU过载。
    watchOptions: {
      ignored: /node_modules/,
    },
  };
  return serverConf;
};
```


您可以使用以下选项配置这些的功能：

- [`devServer.historyApiFallback`](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback) - 配置`disableDotRule`，如果您在使用HTML5历史记录API时需要在路径中使用点。
- [`devServer.https`](https://webpack.js.org/configuration/dev-server/#devserver-https) - 启用具有默认自签名证书的HTTPS，或提供您自己的证书。
- [`devServer.overlay`](https://webpack.js.org/configuration/dev-server/#devserver-overlay) - 禁用编译错误重叠，或者也出现警告。
- [`devServer.proxy`](https://webpack.js.org/configuration/dev-server/#devserver-proxy) - 将某些URL代理到单独的API后端开发服务器。
- [`devServer.setup`](https://webpack.js.org/configuration/dev-server/#devserver-setup) - 访问Express应用程序以将自己的中间件添加到dev服务器。

</details>


<details>
<summary>devServer.https - 启用HTTPS</summary>

```js
module.exports = function (WebpackConf, devServer) {
  if (WebpackConf) {
    // ....
    return WebpackConf
  };
  if (devServer) {
    devServer.https = true
    return devServer;
  }
}
```

</details>


<details>
<summary>devServer.proxy - 使用 Webpack 代理</summary>

> 开发过程中需要模拟后台 API，当后台 API 完成，需要去调用真实后台 API ，这个时候你需要用 Proxy 来代理访问后台服务。  

```js
module.exports = function (WebpackConf, devServer) {
  if (WebpackConf) {
    // ....
    return WebpackConf
  };
  if (devServer) {
    devServer.proxy = {
      '/api': {
        target: 'http://127.0.0.1:1130',
        changeOrigin: true,
      },
      // websokect proxy
      '/api/ws': {
        target: 'ws://localhost:9981',
        ws: true
      },
    }
    return devServer;
  }
}
```

</details>


## Mock API

在项目根目录添加 `mocker/index.js` 文件，再在文件中添加需要模拟的API，相关文档在这里[webpack-api-mocker](https://github.com/jaywcjlove/webpack-api-mocker)，下面来个实例：

```js
const proxy = {
  'GET /api/user': { id: 1, username: 'kenny', sex: 6 },
  'GET /api/user/list': [
    { id: 1, username: 'kenny', sex: 6 }, 
    { id: 2, username: 'kkt', sex: 6 }
  ],
  'POST /api/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: "kkt",
        data: { id: 1, username: 'kktname', sex: 6 }
      });
    } else {
      return res.json({
        status: 'error',
        code: 403
      });
    }
  },
  'DELETE /api/user/:id': (req, res) => {
    console.log('---->', req.body)
    console.log('---->', req.params.id)
    res.send({ status: 'ok', message: '删除成功！' });
  }
}
module.exports = proxy;
```

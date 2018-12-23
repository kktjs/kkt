<p align="center">
  <a href="https://github.com/jaywcjlove/kkt">
    <img src="./website/kkt.svg?sanitize=true">
  </a>
</p>

<p align="center">
  <a href="https://github.com/jaywcjlove/kkt/issues">
    <img src="https://img.shields.io/github/issues/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/network">
    <img src="https://img.shields.io/github/forks/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/stargazers">
    <img src="https://img.shields.io/github/stars/jaywcjlove/kkt.svg">
  </a>
  <a href="https://github.com/jaywcjlove/kkt/releases">
    <img src="https://img.shields.io/github/release/jaywcjlove/kkt.svg">
  </a>
  <a href="https://www.npmjs.com/package/kkt">
    <img src="https://img.shields.io/npm/v/kkt.svg">
  </a>
</p>


Create React apps with no build configuration, Cli tool for creating react apps.

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.

```bash
npm install -g kkt
kkt create my-app # create project
```

## Quick Start

```bash
npx kkt create my-app
cd my-app
npm start
```

You can also initialize a project from one of the examples. Example from [jaywcjlove/kkt](./example) example-path. 

```bash
# Using the template method
npx kkt create my-app -e rematch
```

or

```bash
npm install -g kkt
# Create project, Using the template method
kkt my-app -e rematch
cd my-app # Enter the directory
npm start # Start service
```


## KKT Help

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

在根目录新建 `mocker/index.js`

<details>
<summary>配置文件 mocker/index.js 简单实例</summary>

```js

module.exports = {
  config: (conf, { dev, env }, webpack) => {
    if (dev) {
      conf.devServer.before = (app) => {
        apiMocker(app, path.resolve('./mocker/index.js'), {
          proxy: {
            '/repos/*': 'https://api.github.com/',
          },
          changeHost: true,
        });
      };
    }
    return conf;
  },
};
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
module.exports = {
  config: (conf, { dev, env }, webpack) => {
    conf.module.rules = [
      ...conf.module.rules,
      {
        //.... Add rules
      }
    ]
    return conf;
  },
};
```

</details>

<details>
<summary>ESLint 配置</summary>

ESLint 配置报错可以通过标识到下面三个地方去找解决方法，`kkt` 使用的较为严格的代码规范，通常为了保持项目代码一直，尽量避免代码乱，这些都是必要的。

- [Rules in ESLint](https://eslint.org/docs/rules/)
- [React specific linting rules for ESLint](https://github.com/yannickcr/eslint-plugin-react)
- [Static AST checker for a11y rules on JSX elements.](https://github.com/evcohen/eslint-plugin-jsx-a11y)

如果你是在想禁用，目前没有提供什么好的方法，只能通过上面 `修改默认Rules配置` 将 webpack 默认配置冲掉。

</details>

<details>
<summary>添加一个 Webpack plugins</summary>

下面是添加一个 Webpack plugins 的实例

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  config: (conf, { dev, env }, webpack) => {
    conf.plugins = [
      ...conf.plugins,
      new CleanWebpackPlugin(paths.appBuildDist, {
        root: process.cwd(),
      }),
    ]
    return conf;
  },
};
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
module.exports = {
  config: (conf, { dev, env }, webpack) => {
    if (dev) {
      conf.devServer.https = true;
    }
    return conf;
  },
};
```

</details>


<details>
<summary>devServer.proxy - 使用 Webpack 代理</summary>

> 开发过程中需要模拟后台 API，当后台 API 完成，需要去调用真实后台 API ，这个时候你需要用 Proxy 来代理访问后台服务。  

```js
const path = require('path');
const apiMocker = require('mocker-api');

module.exports = {
  plugins: [
    require.resolve('@kkt/plugin-less'),
  ],
  // Modify the webpack config
  config: (conf, { dev, env }, webpack) => {
    if (env === 'prod') {
    }
    if (dev) {
      conf.devServer.proxy = {
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
      conf.devServer.before = (app) => {
        apiMocker(app, path.resolve('./mocker/index.js'), {
          proxy: {
            '/repos/*': 'https://api.github.com/',
          },
          changeHost: true,
        });
      };
    }
    return conf;
  },
};
```

</details>


## Mock API

在项目根目录添加 `mocker/index.js` 文件，再在文件中添加需要模拟的API，相关文档在这里[webpack-api-mocker](https://github.com/jaywcjlove/webpack-api-mocker)，下面来个实例：

```js
const proxy = {
  // 这里也可以写代理
  _proxy: {
    proxy: {
      '/repos/*': 'https://api.github.com/',
      '/:owner/:repo/raw/:ref/*': 'http://127.0.0.1:2018'
    },
    changeHost: true,
  },
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

## License

[MIT © Kenny Wong](./LICENSE)

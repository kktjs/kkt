kkt
--- 

Create React apps with no build configuration, Cli tool for creating react apps.

## 安装

```bash
npm install -g kkt
```

## 使用

```bash
$ kkt create my-project
$ cd my-project && npm start
```

## webpack 配置修改

在根目录新建 `.kktrc.js` 这里返回两个参数 `webpackConf` 和 `devServer`，返回的是 `webpack` 配置，webpack 配置，区分开发模式和生成模式，是通过 `webpackConf.mode` 的值为 `development | production` 来判断;

```js
module.exports = function (webpackConf, devServer) {
  if (webpackConf) {
    if (webpackConf.mode === 'development') {
      // 开发模式下更改的 webpack 配置
    }
    if (webpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
    }
    return webpackConf
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

### Rules 配置修改

修改替换其中的 `Rules`，这里有 [默认Webpack配置](./conf)，你可以根据默认配置进行替换和删除，好复杂哦。

```js
module.exports = function (webpackConf, devServer) {
  if (webpackConf) {
    webpackConf.module.rules.map((item) => {
      if (item.oneOf) {
        item = item.oneOf.map((childItem) => {
          if (String(/\.(css|less)$/) === String(childItem.test)) {
            childItem.use = childItem.use.map((_childItem) => {
              if (_childItem.loader === require.resolve('css-loader')) {
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

    if (webpackConf.mode === 'development') {
      // 开发模式下更改的 webpack 配置
    }
    if (webpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
    }
    return webpackConf
  };
}
```

## Mock API

在项目根目录添加 `.kktmock.js` 文件，再在文件中添加需要模拟的API，相关文档在这里[webpack-api-mocker](https://github.com/jaywcjlove/webpack-api-mocker)，下面来个实例：

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

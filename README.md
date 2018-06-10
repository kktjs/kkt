kkt
--- 

Cli tool for creating react apps.

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

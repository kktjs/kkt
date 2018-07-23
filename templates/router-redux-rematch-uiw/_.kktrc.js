
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function (webpackConf, ServerConf) {
  if (webpackConf) {
    // 更改各种 Rules 配置
    webpackConf.module.rules.map((item) => {
      if (item.oneOf) {
        item = item.oneOf.map((childItem) => {
          // 修改配置 less
          if (String(/\.(less)$/) === String(childItem.test)) {
            childItem.use = childItem.use.map((_childItem) => {
              if (/node_modules\/css-loader/.test(_childItem.loader)) {
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
                };
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
      // 默认配置 devtool = 'source-map';
      // 大型工程可以删除此配置，非常消耗编译速度
      delete webpackConf.devtool;
    }
    if (webpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
    }
    return webpackConf;
  }
  if (ServerConf) {
    // ServerConf.proxy = {
    //   '/api/*': {
    //     target: 'http://127.0.0.1:9981',
    //     changeOrigin: true,
    //   },
    // }
    // console.log('ServerConf:', ServerConf);
    return ServerConf;
  }
};

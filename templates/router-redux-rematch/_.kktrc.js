module.exports = function (webpackConf, ServerConf) {
  if (webpackConf) {
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
    //   '/api': {
    //     target: 'http://127.0.0.1:1130',
    //     changeOrigin: true,
    //   },
    // }
    return ServerConf;
  }
};

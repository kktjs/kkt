module.exports = function (webpackConf, ServerConf) {
  if (webpackConf) {
    if (webpackConf.mode === 'development') {
      // console.log('webpackConf:', webpackConf);
      // 开发模式下更改的 webpack 配置
      // webpackConf.entry = './path/to/my/entry/file.js';
      // webpackConf.output = {
      //   library: "someLibName",
      //   libraryTarget: "umd",
      //   filename: "someLibName.js",
      //   auxiliaryComment: "Test Comment"
      // }
      // webpackConf.output.auxiliaryComment =
      // delete webpackConf.output;
    }
    if (webpackConf.mode === 'production') {
      // 生产模式下更改的 webpack 配置
      // webpackConf.entry = './path/to/my/entry/file.js';
      // console.log('webpackConf:', webpackConf);
      // webpackConf.output.path = 'wr';
      // console.log('---->', __dirname)
      // webpackConf.output.path = `${__dirname}${path.sep}wr5`;
      // webpackConf.output.path = path.join(__dirname, 'wr2');
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

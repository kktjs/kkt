
module.exports = (dotenv) => {
  const serverConf = {
    // 沉默WebpackDevServer自己的日志，因为它们通常没有用处。
    // 这个设置仍然会显示编译警告和错误。
    clientLogLevel: 'none',
    // Enable gzip compression of generated files.
    compress: true,
    // Tell dev- server to watch the files served by the devServer.contentBase option.
    // It is disabled by default.When enabled, file changes will trigger a full page reload.
    watchContentBase: true,
    publicPath: dotenv.raw.PUBLIC_PATH,
    contentBase: [dotenv.raw.APPDIRECTORY],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    https: process.env.HTTPS, // true
    host: dotenv.raw.HOST,
    hot: true,
    noInfo: true,
    overlay: false,
    port: parseInt(dotenv.raw.PORT, 10),
    // WebpackDevServer默认是嘈杂的，所以我们发出自定义消息
    // 通过上面的`compiler.plugin`调用来监听编译器事件。
    quiet: true,
    // By default files from `contentBase` will not trigger a page reload.
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
  };
  return serverConf;
};

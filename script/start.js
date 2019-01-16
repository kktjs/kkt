// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

require('colors-cli/toxic');
const prepareUrls = require('local-ip-url/prepareUrls');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const detect = require('detect-port');
const createConfig = require('../conf/webpack.config');

const logs = console.log; // eslint-disable-line

// Webpack compile in a try-catch
// function compile(config) {
//   let compiler;
//   try {
//     compiler = webpack(config);
//   } catch (e) {
//     logs('Failed to compile.', [e]); // eslint-disable-line
//     process.exit(1);
//   }
//   return compiler;
// }

module.exports = async () => {
  let DEFAULT_PORT = parseInt(process.env.PORT, 10) || 19870;
  const HOST = process.env.HOST || '0.0.0.0';
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  try {
    const PORT = await detect(DEFAULT_PORT);
    if (DEFAULT_PORT !== PORT) {
      DEFAULT_PORT = PORT;
    }
    process.env.PORT = DEFAULT_PORT;

    const clientConfig = createConfig('dev');
    const compiler = webpack(clientConfig);
    const urls = prepareUrls({ protocol, host: HOST, port: DEFAULT_PORT });
    // Start our server webpack instance in watch mode after assets compile
    compiler.hooks.done.tap('done', () => {
      logs('🚀 started!');
      logs(`Dev Server Listening at Local: ${urls.localUrl.green}`);
      logs(`              On Your Network: ${urls.lanUrl.green}`);
      logs(`\nTo create a production build, use ${'npm run build'.blue_bt}.`);
    });
    // Create a new instance of Webpack-dev-server for our client assets.
    // This will actually run on a different port than the users app.
    const clientDevServer = new WebpackDevServer(compiler, clientConfig.devServer);

    // Start Webpack-dev-server
    clientDevServer.listen(DEFAULT_PORT, HOST, (err) => {
      if (err) {
        logs('clientDevServer:', err); // eslint-disable-line
      }
      logs('clientDevServer22:', DEFAULT_PORT);
    });
  } catch (error) {
    logs(':::::::3error::', error);
  }
};

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const createConfig = require('../conf/webpack.config');

const logs = console.log; // eslint-disable-line

module.exports = async () => {
  try {
    const clientConfig = createConfig('dev');
    const compiler = webpack(clientConfig);
    // eslint-disable-next-line
    compiler.watch({ ...clientConfig.watchOptions }, (err, stats) => {
      if (err) {
        logs('❌ errors:', err);
        return;
      }
      logs('🚀 started!');
    // logs(`\nTo create a production build, use.`);
    });
  } catch (error) {
    logs('❌ error::', error);
  }
};

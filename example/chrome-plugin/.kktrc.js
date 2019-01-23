const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
  plugins: [],
  // Modify the webpack config
  config: (conf, { dev, env, ...other }, webpack) => {
    conf = {
      ...conf,
      devtool: 'source-map',
      entry: other.appIndex,
      output: {
        filename: 'js/[hash:8].[name].js',
        path: other.appBuildDist,
      },
      plugins: [
        ...conf.plugins.filter(item => item.constructor && item.constructor.name !== 'HotModuleReplacementPlugin'),
        new CleanWebpackPlugin(['dist'], {
          root: process.cwd(),
        }),
        new FileManagerPlugin({
          onEnd: [{
            copy: [
              { source: './chrome-main/manifest.json', destination: './dist/manifest.json' },
              { source: './chrome-main/background.js', destination: './dist/background.js' },
              { source: './chrome-main/logo.png', destination: './dist/logo.png' },
            ],
          }],
        }),
      ]
    }



    conf = {
      ...conf,
      optimization: {
        ...conf.optimization,
        // https://webpack.js.org/plugins/split-chunks-plugin/
        // splitChunks: {
        //   chunks: 'async',
        //   minSize: 30000,
        //   minChunks: 2,
        //   maxAsyncRequests: 5,
        //   maxInitialRequests: 3,
        //   automaticNameDelimiter: '~',
        //   name: true,
        //   cacheGroups: {
        //     vendors: {
        //       test: /[\\/]node_modules[\\/]/,
        //       priority: -10
        //     },
        //     default: {
        //       minChunks: 2,
        //       priority: -20,
        //       reuseExistingChunk: true
        //     }
        //   }
        // }
      }
    };

    if (env === 'prod') {
      // conf = {
      //   ...conf,
      //   optimization: {
      //     ...conf.optimization,
      //     // https://webpack.js.org/plugins/split-chunks-plugin/
      //     splitChunks: {
      //     }
      //   }
      // };
    }
    return conf;
  },
};

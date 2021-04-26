import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';

export default (conf, env, options) => {
  conf.output.publicPath = './';
  // const regexp = /(HotModuleReplacementPlugin)/;
  // conf.plugins = conf.plugins
  //   .map((item) => {
  //     if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
  //       return null;
  //     }
  //     return item;
  //   })
  //   .filter(Boolean);

  conf.plugins.push(new CleanWebpackPlugin());
  conf.plugins.push(
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: './chrome-main/manifest.json', destination: './dist/manifest.json' },
            { source: './chrome-main/background.js', destination: './dist/background.js' },
            { source: './chrome-main/logo.png', destination: './dist/logo.png' },
          ],
        },
      },
    }),
  );

  return conf;
};

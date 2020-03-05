import CleanWebpackPlugin from 'clean-webpack-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';

export default (conf) => {
  conf.output.publicPath = './';
  const regexp = /(HotModuleReplacementPlugin)/;
  conf.plugins = conf.plugins.map((item) => {
    if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
      return null;
    }
    return item;
  }).filter(Boolean);

  conf.plugins.push(new CleanWebpackPlugin(['build'], {
    root: process.cwd(),
  }));
  conf.plugins.push(new FileManagerPlugin({
    onEnd: [{
      copy: [
        { source: './chrome-main/manifest.json', destination: './build/manifest.json' },
        { source: './chrome-main/background.js', destination: './build/background.js' },
        { source: './chrome-main/logo.png', destination: './build/logo.png' },
      ],
    }],
  }));
  /**
   * Do somthing
   */
  return conf;
}


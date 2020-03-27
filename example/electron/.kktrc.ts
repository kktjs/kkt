import { OptionConf } from 'kkt';
import webpack from 'webpack';

type Webpack = typeof webpack;

export default (conf: webpack.Configuration = {}, opts: OptionConf, webpack: Webpack) => {
  conf.output!.publicPath = './';
  const regexp = /(GenerateSW)/;
  if (conf.plugins) {
    conf.plugins = conf.plugins.map((item) => {
      if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
        return null;
      }
      return item;
    }).filter(Boolean) as webpack.Plugin[];
  }
  /**
   * Do somthing
   */
  return conf;
}

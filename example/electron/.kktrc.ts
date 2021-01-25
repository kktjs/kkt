import webpack from 'webpack';
import lessModules from '@kkt/less-modules';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';

export default (conf: WebpackConfiguration, env: string, options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  conf.output!.publicPath = './';
  const regexp = /(GenerateSW)/;
  if (conf.plugins) {
    conf.plugins = conf.plugins
      .map((item) => {
        if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
          return null;
        }
        return item;
      })
      .filter(Boolean) as webpack.Plugin[];
  }
  return conf;
};

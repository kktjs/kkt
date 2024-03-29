import { Configuration, WebpackPluginInstance } from 'webpack';
import lessModules from '@kkt/less-modules';
import { LoaderConfOptions } from 'kkt';

export default (conf: Configuration, env: 'development' | 'production', options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  const regexp = /(GenerateSW)/;
  if (conf.plugins) {
    conf.plugins = conf.plugins
      .map((item) => {
        if (item.constructor && item.constructor.name && regexp.test(item.constructor.name)) {
          return null;
        }
        return item;
      })
      .filter(Boolean) as WebpackPluginInstance[];
  }
  if (env === 'production') {
    conf.output = { ...conf.output, publicPath: './' };
  }
  return conf;
};

import webpack from 'webpack';
import lessModules from '@kkt/less-modules';
import { LoaderConfOptions, WebpackConfiguration } from 'kkt';
import pkg from './package.json';

export default (conf: WebpackConfiguration, env: string, options: LoaderConfOptions) => {
  conf = lessModules(conf, env, options);
  // Get the project version.
  conf.plugins!.push(
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    }),
  );
  return conf;
};
